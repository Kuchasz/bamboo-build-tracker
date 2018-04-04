#include "BambooConfig.h"
#include <rBase64.h>

bool BambooConfig::IsConfigured()
{
    std::array<String, 5> restrictions = {
        this->login,
        this->password,
        this->project,
        this->plan,
        this->url};

    return std::all_of(restrictions.begin(), restrictions.end(), [](String restriction) { return restriction.length() > 0; });
}

String BambooConfig::GetAuth()
{
    rbase64.encode(this->login + ":" + this->password);
    return "Basic " + String(rbase64.result());
}

String BambooConfig::GetAuth(String login, String password)
{
    rbase64.encode(login + ":" + password);
    return "Basic " + String(rbase64.result());
}

void BambooConfig::FetchFailed()
{
    this->retriesCount++;
    if (this->retriesCount > 5)
    {
        this->connected = false;
        this->lifeCycleState = "";
        this->state = "";
        this->aware = false;
    }
}

BuildState BambooConfig::GetState()
{
    if (this->state == "Successful")
        return Successful;

    if (this->state == "Failed")
        return Failed;

    if (this->lifeCycleState == "InProgress")
        return InProgress;

    return Unspecified;
}

void BambooConfig::EditBuildState(String state, String lifeCycleState)
{
    if (this->state != state || this->lifeCycleState != lifeCycleState)
        this->aware = false;
    this->state = state;
    this->lifeCycleState = lifeCycleState;
}

void BambooConfig::ConfigureConnection(String url, String login, String password)
{
    this->url = url;
    this->login = login;
    this->password = password;
    this->connected = true;
}

String BambooConfig::GetProjectsUrl()
{
    return this->url + "/rest/api/latest/project.json?os_authType=basic&max-result=1000";
}

String BambooConfig::GetPlansUrl()
{
    return this->url + "/rest/api/latest/project/" + this->project + ".json?os_authType=basic&expand=plans&max-result=1000";
}

String BambooConfig::GetBuildStateUrl()
{
    return this->url + "/rest/api/latest/result/" + this->plan + ".json?os_authType=basic&includeAllStates=true&max-results=1";
}

void BambooConfig::MarkAsAware()
{
    this->aware = true;
}

bool BambooConfig::IsAware(){
    return this->aware;
}