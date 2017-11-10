const fakeAlarmConfig = {
    lightState: true,
    signalState: false
};

export interface AlarmConfig {
    lightState: boolean;
    signalState: boolean;
}

export const toggleLight = () => new Promise<void>(res => {
    setTimeout(() => {
        fakeAlarmConfig.lightState = !fakeAlarmConfig.lightState;
        res();
    }, 250);
});

export const toggleSignal = () => new Promise<void>(res => {
    setTimeout(() => {
        fakeAlarmConfig.signalState = !fakeAlarmConfig.signalState;
        res();
    }, 250);
});

export const getAlarmConfig = () => new Promise<AlarmConfig>(res => {
    setTimeout(()=>{
        res({...fakeAlarmConfig})
    }, 250);
});