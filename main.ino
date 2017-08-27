bool buttonTriggerState = HIGH;
void handleButtonState(){
    auto buttonState = digitalRead(10);
    if(buttonTriggerState != buttonState){
        if (buttonState == LOW){
            digitalWrite(D1, HIGH);
            digitalWrite(D2, HIGH);
            // tone(D6, 1000);
        } else {
            digitalWrite(D1, LOW);
            digitalWrite(D2, LOW);
            // noTone(D6);
        }
    }
    buttonTriggerState = buttonState;
}

void setup(){
    Serial.begin(115200);
    pinMode(10, INPUT);
    pinMode(D1, OUTPUT);
    pinMode(D2, OUTPUT);
}

void loop(){
    handleButtonState();
}