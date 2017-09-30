export type Network = {
    ssid: string;
    isSecured: boolean;
}

export enum NetworkConnectionStatus {
    Disconnected,
    Connected
}

export type NetworkConfig = {
    ssid: string;
    status: NetworkConnectionStatus;
    password: string;
}

type ServerSideNetwork = Network & { password?: string };

const fixedNetworks: ServerSideNetwork[] = [{
    ssid: 'Nania',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Marvel',
    isSecured: false
}, {
    ssid: 'DC Comics',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Squirle',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Marcus figo',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Tora tora',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Szakawina',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Merlin',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Hellfire',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'GoldeN',
    isSecured: true,
    password: '1234'
}, {
    ssid: 'Baoblir',
    isSecured: false
}];

let connectedNetworkSSID = "Hellfire";

export const getNetworks = () => {
    return new Promise<Network[]>((res: ((value: Network[]) => void)) => {
        setTimeout(() => res(fixedNetworks), 250);
    });
};

export const getNetworkConfig = () => new Promise<NetworkConfig>(res=>{
    setTimeout(()=>{
        res({
            ssid: 'Szakawina',
            password: Array.from(Array(4)).reduce(s => `${s}*`, ''),
            status: NetworkConnectionStatus.Connected
        });
    }, 250);
});

export const connectToNetwork = (ssid: string, password: string) => new Promise((res, rej) => {
    setTimeout(() => {
        const networkCandidates = fixedNetworks.filter(n => n.ssid === ssid);
        if (networkCandidates.length !== 1) rej();

        const networkToConnect = networkCandidates[0];
        if (networkToConnect.password && networkToConnect.password !== password) rej();

        connectedNetworkSSID = networkToConnect.ssid;
        res();
    }, 250);
});

export const disconnectFromNetwork = () => new Promise((res) => {
    setTimeout(()=>res(), 250);
});