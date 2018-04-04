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
Ticker alarmsTicker;

int getTune()
{
  int tunes[] = {262, 294, 330, 349, 392, 440, 494, 523};
  return tunes[rand() % 8];
}

void handleButtonState()
{
  auto buttonState = digitalRead(D0);
  Serial.println(buttonState);
  if (buttonState == HIGH)
  {
    bambooConfig.MarkAsAware();
  }
}

void handleAlarms()
{
  if (digitalRead(D6) || digitalRead(D7) || digitalRead(D8))
  {
    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);
    return;
  }

  if (!bambooConfig.connected || !bambooConfig.IsConfigured())
  {
    digitalWrite(D6, HIGH);
    digitalWrite(D7, HIGH);
    digitalWrite(D8, HIGH);
    return;
  }

  if (!bambooConfig.IsAware())
  {
    tone(D2, getTune(), 100);
  }

  if (bambooConfig.GetState() == InProgress)
  {
    digitalWrite(D6, LOW);
    digitalWrite(D7, HIGH);
    digitalWrite(D8, LOW);
    return;
  }

  if (bambooConfig.GetState() == Failed)
  {
    digitalWrite(D6, HIGH);
    digitalWrite(D7, LOW);
    digitalWrite(D8, LOW);
    return;
  }

  if (bambooConfig.GetState() == Successful)
  {
    digitalWrite(D6, LOW);
    digitalWrite(D7, LOW);
    digitalWrite(D8, HIGH);
    return;
  }
}

void fetchBuildState()
{
  if (!bambooConfig.IsConfigured())
  {
    return;
  }

  Serial.println("Bamboo configured");

  String requestUrl = bambooConfig.GetBuildStateUrl();

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

    String state = buildState["results"]["result"][0]["state"];
    String lifeCycleState = buildState["results"]["result"][0]["lifeCycleState"];

    bambooConfig.EditBuildState(state, lifeCycleState);
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

  pinMode(D0, INPUT);
  pinMode(D2, OUTPUT);

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

      bambooConfig.ConfigureConnection(url, login, password);

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

    String requestUrl = bambooConfig.GetProjectsUrl();

    Serial.println(requestUrl);

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
    String requestUrl = bambooConfig.GetPlansUrl();

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

    response["url"] = "";
    response["login"] = "";
    response["password"] = "";
    response["connected"] = bambooConfig.connected;
    response["project"] = bambooConfig.project;
    response["plan"] = bambooConfig.plan;

    String responseString;
    response.printTo(responseString);

    server.send(200, "text/json", responseString);
  });

  server.begin();
  Serial.println("server-started");

  alarmsTicker.attach(1, []() {
    handleAlarms();
  });
  buildStateReader.attach(5, []() {
    fetchBuildState();
  });
}

void loop()
{
  server.handleClient();
  handleButtonState();
}
