#include "BambooConfig.h"
#include <rBase64.h>

bool BambooConfig::IsConfigured(){

    std::array<String, 5> restrictions = {
        this->login,
        this->password,
        this->project,
        this->plan,
        this->url
    };

    return std::any_of(restrictions.begin(), restrictions.end(), [](String restriction) { return restriction.length() > 0; });
}

String BambooConfig::GetAuth(){
    return "Basic " + rbase64.encode(this->login + ":" + this->password);
}

String BambooConfig::GetAuth(String login, String password){
    return "Basic " + rbase64.encode(login + ":" + password);
}