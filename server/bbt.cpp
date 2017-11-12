#include "bbt.h"
#include <ArduinoJson.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <sstream>
#include <vector>
#include <string>

const char* apSSID = "BambooBuildTracker";

IPAddress apIP(192, 168, 1, 1);
IPAddress apGateway(192, 168, 1, 1);
IPAddress apSubmask(255, 255, 255, 0);

ESP8266WebServer server(80);

std::vector<char const*> networkSettings(4);

int getOneOrZero(){
    return rand()%2;
}

int* getDiodeToUse(int* arrStates) {
    arrStates[0] = getOneOrZero();
    arrStates[1] = getOneOrZero();
    arrStates[2] = getOneOrZero();
    return arrStates;
}

int getTune(){
    int tunes[] = {262, 294, 330, 349, 392, 440, 494, 523};
    return tunes[rand()%8];
}

int buttonTriggerState = HIGH;

void handleButtonState(){
    auto buttonState = digitalRead(10);
    if(buttonTriggerState != buttonState){
        if (buttonState == LOW){
            int* diodeStates = getDiodeToUse(new int[3]);

            Serial.println(diodeStates[0]);
            Serial.println(diodeStates[1]);
            Serial.println(diodeStates[2]);

            digitalWrite(D6, diodeStates[0]);
            digitalWrite(D7, diodeStates[1]);
            digitalWrite(D8, diodeStates[2]);
            tone(D0, getTune());
        } else {
            digitalWrite(D6, LOW);
            digitalWrite(D7, LOW);
            digitalWrite(D8, LOW);
            noTone(D0);
        }
    }
    buttonTriggerState = buttonState;
}

void setup(){
    Serial.begin(115200);

    WiFi.softAP(apSSID);
    WiFi.softAPConfig(apIP, apGateway, apSubmask);

    server.on("/network", HTTP_GET, []() {
		StaticJsonBuffer<500> jsonBuffer;
		JsonArray& root = jsonBuffer.createArray();

        int n = WiFi.scanNetworks();
		for(auto i = 0; i < n; i++){
			JsonObject& network = jsonBuffer.createObject();
//			network["ssid"] = WiFi.SSID(i);
			network["isSecured"] = WiFi.encryptionType(i) != ENC_TYPE_NONE;
			root.add(network);
		}

		String networksString;
		root.printTo(networksString);

		server.send(200, "text/json", networksString);
    });

    server.on("/network/connect", HTTP_GET, [](){

        WiFi.begin("Profit", "44441111");
        while (WiFi.status() != WL_CONNECTED) {
            delay(100);
        }

        std::stringstream ss;
        auto mac = WiFi.macAddress();

        for (size_t i = 0; i < 6; ++i) {
            ss << mac[i];
            if (i != 5) ss << ":";
        }
        std::string MACstring = ss.str();

        String foo = WiFi.localIP().toString();

        networkSettings.at(0) = "Profit";
        networkSettings.at(1) = "44441111";
        networkSettings.at(2) = foo.c_str();
        networkSettings.at(3) = MACstring.c_str();

    });

    server.on("/network/config", HTTP_GET, [](){

    	StaticJsonBuffer<200> jsonBuffer;
    	JsonObject& root = jsonBuffer.createObject();

    	root["ssid"] = networkSettings.at(0);
    	root["isSecured"] = networkSettings.at(1);
    	root["ip"] = networkSettings.at(2);
    	root["mac"] = networkSettings.at(3);
    	root["status"] = 0;

		String networkConfigString;
		root.printTo(networkConfigString);

		server.send(200, "text/json", networkConfigString);

        // ssid: 'Szakawina',
        // password: Array.from(Array(4)).reduce(s => `${s}*`, ''),
        // status: NetworkConnectionStatus.Connected,
        // ip: '10.110.12.12',
        // mac: 'a4:17:31:4b:97:f1'

    });

    server.begin();

    // pinMode(10, INPUT);
    // pinMode(D0, OUTPUT);
    // pinMode(D6, OUTPUT);
    // pinMode(D7, OUTPUT);
    // pinMode(D8, OUTPUT);
}

void loop(){

    server.handleClient();

    // handleButtonState();
}
