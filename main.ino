#include <ESP8266WiFi.h>

void setup(){
    Serial.begin(115200);
    WiFi.begin("NETUS_FIBER_STRAZ", "straz123456");


    Serial.println("Connecting to WiFi network");
    while (WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print(".");
    }

    Serial.println("Connected!");
}

void loop(){
    
}