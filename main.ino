#include <ESP8266WiFi.h>

void setup(){
    Serial.begin(115200);

    pinMode(10, INPUT);
    pinMode(D2, OUTPUT);

    // WiFi.begin("NETUS_FIBER_STRAZ", "straz123456");


    // Serial.println("Connecting to WiFi network");
    // while (WiFi.status() != WL_CONNECTED){
    //     delay(500);
    //     Serial.print(".");
    // }

    // Serial.println("Connected!");
}

void loop(){
    auto code = digitalRead(10);
    digitalWrite(D2, code);
}