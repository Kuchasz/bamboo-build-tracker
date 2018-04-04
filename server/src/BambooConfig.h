#include <Arduino.h>
#include "BuildState.h"

class BambooConfig {
    private:
        int retriesCount = 0;
        String state;
        String lifeCycleState;
        String url;
        String login;
        String password;
        bool aware;
    public: 
        bool connected = false;
        String project;
        String plan;
        void ConfigureConnection(String url, String login, String password);
        bool IsConfigured();
        bool IsAware();
        void FetchFailed();
        String GetAuth();
        String GetAuth(String login, String password);
        BuildState GetState();
        void EditBuildState(String state, String lifeCycleState);
        String GetProjectsUrl();
        String GetPlansUrl();
        String GetBuildStateUrl();
        void MarkAsAware();
};