#include <ArduinoJson.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <FS.h>

const char *apSSID = "BambooBuildTracker";

IPAddress apIP(10, 0, 0, 1);
IPAddress apGateway(10, 0, 0, 1);
IPAddress apSubmask(255, 255, 255, 0);

ESP8266WebServer server(80);

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

void setup()
{
  Serial.begin(115200);
  SPIFFS.begin();

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
    Serial.println(server.uri());

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
    Serial.println(server.uri());

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &request = jsonBuffer.parseObject(server.arg("plain"));

    String url = request["url"];
    String login = request["login"];
    String password = request["password"];

    Serial.println(url);
    Serial.println(login);
    Serial.println(password);

    // HTTPClient http;
    String requestUrl = url + "/rest/api/latest/currentUser.json?os_authType=basic";
    Serial.println(requestUrl);
    // http.begin("");

    //  request({
    //     url: `${url}/rest/api/latest/currentUser.json?os_authType=basic`,
    //     headers: { Authorization: `Basic ${auth}` }
    // }).on("response", resp => {
    //     if (resp.statusCode === 200) {
    //         bambooConfig = {
    //             ...bambooConfig,
    //             ...{
    //                 login,
    //                 password,
    //                 url: url
    //             },
    //             connected: true
    //         };
    //         res.send(JSON.stringify({ result: 1 }));
    //     } else {
    //         res.send(JSON.stringify({ result: 0 }));
    //     }
    // });

    server.send(200, "text/plain", url);
  });

  server.begin();
  Serial.println("server-started");
}

void loop()
{
  server.handleClient();
}
