# 1 "/media/rafau/Nowy/Projects/bamboo-build-tracker/server/main.ino"
# 1 "/media/rafau/Nowy/Projects/bamboo-build-tracker/server/main.ino"
# 2 "/media/rafau/Nowy/Projects/bamboo-build-tracker/server/main.ino" 2
# 3 "/media/rafau/Nowy/Projects/bamboo-build-tracker/server/main.ino" 2
# 4 "/media/rafau/Nowy/Projects/bamboo-build-tracker/server/main.ino" 2
# 5 "/media/rafau/Nowy/Projects/bamboo-build-tracker/server/main.ino" 2

const char* apSSID = "BambooBuildTracker";

IPAddress apIP(192, 168, 1, 1);
IPAddress apGateway(192, 168, 1, 1);
IPAddress apSubmask(255, 255, 255, 0);

ESP8266WebServer server(80);

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

int buttonTriggerState = 0x1;

void handleButtonState(){
    auto buttonState = digitalRead(10);
    if(buttonTriggerState != buttonState){
        if (buttonState == 0x0){
            int* diodeStates = getDiodeToUse(new int[3]);

            Serial.println(diodeStates[0]);
            Serial.println(diodeStates[1]);
            Serial.println(diodeStates[2]);

            digitalWrite(D6, diodeStates[0]);
            digitalWrite(D7, diodeStates[1]);
            digitalWrite(D8, diodeStates[2]);
            tone(D0, getTune());
        } else {
            digitalWrite(D6, 0x0);
            digitalWrite(D7, 0x0);
            digitalWrite(D8, 0x0);
            noTone(D0);
        }
    }
    buttonTriggerState = buttonState;
}

void setup(){
    Serial.begin(115200);

    WiFi.softAP(apSSID);
    WiFi.softAPConfig(apIP, apGateway, apSubmask);

    server.on("/networks", HTTP_GET, []() {
  StaticJsonBuffer<200> jsonBuffer;
  JsonArray& root = jsonBuffer.createArray();

        int n = WiFi.scanNetworks();
  for(auto i = 0; i < n; i++){
   JsonObject& network = jsonBuffer.createObject();
   network["ssid"] = WiFi.SSID(i);
   network["isSecured"] = WiFi.encryptionType(i) != ENC_TYPE_NONE;
   root.add(network);
  }

  String networksString;
  root.printTo(networksString);

  server.send(200, "text/json", networksString);
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
