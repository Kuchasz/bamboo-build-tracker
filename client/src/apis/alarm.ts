import {delay} from "./common";

let fakeAlarmConfig = {
    lightState: true,
    signalState: false
};

export interface AlarmConfig {
    lightState: boolean;
    signalState: boolean;
}

export const toggleLight = () => delay().then(() => fakeAlarmConfig = {
    ...fakeAlarmConfig,
    lightState: !fakeAlarmConfig.lightState
});

export const toggleSignal = () => delay().then(() => fakeAlarmConfig = {
    ...fakeAlarmConfig,
    signalState: !fakeAlarmConfig.signalState
});

export const getAlarmConfig = () => delay().then(() => ({...fakeAlarmConfig}));