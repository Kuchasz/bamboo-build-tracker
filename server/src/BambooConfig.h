#include <Arduino.h>

class BambooConfig {
    private:
    public: 
        BambooConfig();
        String url;
        String login;
        String password;
        bool connected;
        String project;
        String plan;
};