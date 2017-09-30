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
    pinMode(10, INPUT);
    pinMode(D0, OUTPUT);
    pinMode(D6, OUTPUT);
    pinMode(D7, OUTPUT);
    pinMode(D8, OUTPUT);
}

void loop(){
    handleButtonState();
}