export interface AlarmConfig {
    lightState: boolean;
    signalState: boolean;
}

export const toggleLight = () => new Promise<void>(res => {
    setTimeout(() => {
        res();
    }, 250);
});

export const toggleSignal = () => new Promise<void>(res => {
    setTimeout(() => {
        res();
    }, 250);
});

export const getAlarmConfig = () => new Promise<AlarmConfig>(res => {
    setTimeout(()=>{
        res({
            lightState: true,
            signalState: false
        })
    }, 250);
});