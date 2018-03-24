#include <Arduino.h>

class BambooConfig {
    private:
        int retriesCount = 0;
    public: 
        String url;
        String login;
        String password;
        bool connected = false;
        String project;
        String plan;
        String state;
        String lifeCycleState;
        bool IsConfigured();
        void FetchFailed();
        String GetAuth();
        String GetAuth(String login, String password);
};