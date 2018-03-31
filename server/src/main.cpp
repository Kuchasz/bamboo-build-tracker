#include <ArduinoJson.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <FS.h>

#include <ESP8266HTTPClient.h>
#include "BambooConfig.h"
#include <Ticker.h>

const char *apSSID = "BambooBuildTracker";

IPAddress apIP(10, 0, 0, 1);
IPAddress apGateway(10, 0, 0, 1);
IPAddress apSubmask(255, 255, 255, 0);

ESP8266WebServer server(80);

BambooConfig bambooConfig;

Ticker buildStateReader;

//int getOneOrZero() {
//  return rand() % 2;
//}
//
//int* getDiodeToUse(int* arrStates) {
//  arrStates[0] = getOneOrZero();
//  arrStates[1] = getOneOrZero();
//  arrStates[2] = getOneOrZero();
//  return arrStates;
//}
//
//int getTune() {
//  int tunes[] = {262, 294, 330, 349, 392, 440, 494, 523};
//  return tunes[rand() % 8];
//}
//
//int buttonTriggerState = HIGH;
//
//void handleButtonState() {
//  auto buttonState = digitalRead(10);
//  if (buttonTriggerState != buttonState) {
//    if (buttonState == LOW) {
//      int* diodeStates = getDiodeToUse(new int[3]);
//
//      Serial.println(diodeStates[0]);
//      Serial.println(diodeStates[1]);
//      Serial.println(diodeStates[2]);
//
//      digitalWrite(D6, diodeStates[0]);
//      digitalWrite(D7, diodeStates[1]);
//      digitalWrite(D8, diodeStates[2]);
//      tone(D0, getTune());
//    } else {
//      digitalWrite(D6, LOW);
//      digitalWrite(D7, LOW);
//      digitalWrite(D8, LOW);
//      noTone(D0);
//    }
//  }
//  buttonTriggerState = buttonState;
//}

int tick = 0;

void handleAlarms()
{
  if (digitalRead(D6) || digitalRead(D7) || digitalRead(D8))
  {
    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);
    return;
  }

  if (!bambooConfig.connected || !bambooConfig.IsConfigured()){
     digitalWrite(D6, HIGH);
     digitalWrite(D7, HIGH);
     digitalWrite(D8, HIGH);
    return;
  }

  if (bambooConfig.lifeCycleState == "InProgress")
  {
    digitalWrite(D6, LOW);
    digitalWrite(D7, HIGH);
    digitalWrite(D8, LOW);
    return;
  }

  if (bambooConfig.state == "Failed")
  {
    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, HIGH);
    return;
  }

  if (bambooConfig.state == "Successful")
  {
    digitalWrite(D6, HIGH);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);
    return;
  }

  //that line should never happen, arduino does not support exceptions
}

void fetchBuildState()
{
  tick = 0;

  if (!bambooConfig.IsConfigured())
  {
    return;
  }

  Serial.println("Bamboo configured");

  String requestUrl = bambooConfig.url + "/rest/api/latest/result/" + bambooConfig.plan + ".json?os_authType=basic&includeAllStates=true&max-results=1";

  HTTPClient http;
  http.begin(requestUrl);
  http.addHeader("Authorization", bambooConfig.GetAuth());

  int httpCode = http.GET();

  String responseString;
  if (httpCode == HTTP_CODE_OK)
  {
    responseString = http.getString();

    StaticJsonBuffer<2000> jsonBuffer;
    JsonObject &buildState = jsonBuffer.parseObject(responseString);

    String lifeCycleState = buildState["results"]["result"][0]["lifeCycleState"];
    bambooConfig.lifeCycleState = lifeCycleState;

    String state = buildState["results"]["result"][0]["state"];
    bambooConfig.state = state;
  }
  else
  {
    responseString = http.getString();
    bambooConfig.FetchFailed();
  }

  http.end();
}

void setup()
{
  Serial.begin(115200);
  SPIFFS.begin();

  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);
  pinMode(D8, OUTPUT);

  WiFi.softAP(apSSID);
  WiFi.softAPConfig(apIP, apGateway, apSubmask);

  server.on("/", HTTP_GET, []() {
    Serial.println(server.uri());
    File rootHtml = SPIFFS.open("/index.html", "r");
    Serial.println("Opened File");
    Serial.println(rootHtml.size());

    if (server.streamFile(rootHtml, "text/html") != rootHtml.size())
    {
      Serial.println("Sent less data than expected!");
    }

    Serial.println("File sent");
  });

  server.on("/networks", HTTP_GET, []() {
    Serial.println(server.uri());
    StaticJsonBuffer<200> jsonBuffer;
    JsonArray &response = jsonBuffer.createArray();

    int numberOfNetworks = WiFi.scanNetworks();

    for (auto i = 0; i < numberOfNetworks; i++)
    {
      JsonObject &network = jsonBuffer.createObject();
      network["ssid"] = WiFi.SSID(i);
      network["isSecured"] = WiFi.encryptionType(i) != ENC_TYPE_NONE;
      response.add(network);
    }

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.on("/network-config", HTTP_GET, []() {
    Serial.println(server.uri());
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &response = jsonBuffer.createObject();

    response["ssid"] = WiFi.SSID();
    response["password"] = "****";
    int status = WiFi.status() == WL_CONNECTED;
    response["status"] = status;
    response["ip"] = WiFi.localIP().toString();
    response["mac"] = WiFi.macAddress();

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.on("/network-connect", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/network-connect", HTTP_POST, []() {
    Serial.println(server.uri());

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &request = jsonBuffer.parseObject(server.arg("plain"));

    const char *ssid = request["ssid"];
    const char *password = request["password"];

    WiFi.begin(ssid, password);

    int tries = 0;
    while (WiFi.status() != WL_CONNECTED || tries == 3)
    {
      delay(500);
      tries++;
    }

    JsonObject &response = jsonBuffer.createObject();
    if (WiFi.status() == WL_CONNECTED)
      response["result"] = 1;
    else
      response["result"] = 0;

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.on("/network-disconnect", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/network-disconnect", HTTP_POST, []() {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &response = jsonBuffer.createObject();

    response["result"] = 1;

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
    if (WiFi.isConnected())
      WiFi.disconnect();
  });

  server.on("/bamboo-connect", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/bamboo-connect", HTTP_POST, []() {

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &request = jsonBuffer.parseObject(server.arg("plain"));

    String url = request["url"];
    String login = request["login"];
    String password = request["password"];

    String requestUrl = url + "/rest/api/latest/currentUser.json?os_authType=basic";

    HTTPClient http;
    http.begin(requestUrl);
    http.addHeader("Authorization", bambooConfig.GetAuth(login, password));

    int httpCode = http.GET();

    JsonObject &response = jsonBuffer.createObject();

    if (httpCode == HTTP_CODE_OK)
    {
      String payload = http.getString();

      bambooConfig.url = url;
      bambooConfig.login = login;
      bambooConfig.password = password;
      bambooConfig.connected = true;
      bambooConfig.state = "";
      bambooConfig.lifeCycleState = "";

      response["result"] = 1;
    }
    else
    {
      response["result"] = 0;
    }

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
    http.end();
  });

  server.on("/bamboo-projects", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/bamboo-projects", HTTP_GET, []() {
    String url = bambooConfig.url;
    String password = bambooConfig.password;
    String login = bambooConfig.login;

    String requestUrl = url + "/rest/api/latest/project.json?os_authType=basic&max-result=1000";

    HTTPClient http;
    http.begin(requestUrl);
    http.addHeader("Authorization", bambooConfig.GetAuth());

    int httpCode = http.GET();

    String responseString;
    if (httpCode == HTTP_CODE_OK)
    {
      responseString = http.getString();
    }

    server.send(200, "text/json", responseString);
    http.end();
  });

  server.on("/bamboo-plans", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/bamboo-plans", HTTP_GET, []() {
    String url = bambooConfig.url;
    String password = bambooConfig.password;
    String login = bambooConfig.login;

    String requestUrl = url + "/rest/api/latest/project/" + bambooConfig.project + ".json?os_authType=basic&expand=plans&max-result=1000";

    HTTPClient http;
    http.begin(requestUrl);
    http.addHeader("Authorization", bambooConfig.GetAuth());

    int httpCode = http.GET();

    String responseString;
    if (httpCode == HTTP_CODE_OK)
    {
      responseString = http.getString();
    }

    server.send(200, "text/json", responseString);
    http.end();
  });

  server.on("/bamboo-select-project", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/bamboo-select-project", HTTP_POST, []() {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &request = jsonBuffer.parseObject(server.arg("plain"));

    String project = request["project"];
    bambooConfig.project = project;

    JsonObject &response = jsonBuffer.createObject();
    response["result"] = 1;

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.on("/bamboo-select-plan", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/bamboo-select-plan", HTTP_POST, []() {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &request = jsonBuffer.parseObject(server.arg("plain"));

    String plan = request["plan"];
    bambooConfig.plan = plan;

    JsonObject &response = jsonBuffer.createObject();
    response["result"] = 1;

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.on("/bamboo-config", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "*");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });
  server.on("/bamboo-config", HTTP_GET, []() {
    StaticJsonBuffer<200> jsonBuffer;

    JsonObject &response = jsonBuffer.createObject();

    response["url"] = bambooConfig.url;
    response["login"] = bambooConfig.login;
    response["password"] = bambooConfig.password;
    response["connected"] = bambooConfig.connected;
    response["project"] = bambooConfig.project;
    response["plan"] = bambooConfig.plan;

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.begin();
  Serial.println("server-started");

  buildStateReader.attach(1, []() { tick++; handleAlarms(); });
}

void loop()
{
  server.handleClient();
  if (tick == 5)
    fetchBuildState();
}
