import {delay} from "./common";

export type Network = {
    ssid: string;
    isSecured: boolean;
};

export enum NetworkConnectionStatus {
    Disconnected,
    Connected
}

export type NetworkConfig = {
    ssid: string;
    status: NetworkConnectionStatus;
    password: string;
    ip: string;
    mac: string;
};

type ServerSideNetwork = Network & { password?: string };

const ssids = ["Niania", "Forfang AP", "K00by'acky", "Merlin CCP", "LoToS", "BerkSterm Cycles", "GOLD", "Kotlyn", "Zalandoo Net", "XONE.PS4", "Saturn Ennergy", "LoosLey", "DM.Jyoan", "Jeronimo", "LeaDPro WIFI"];

const fixedNetworks: ServerSideNetwork[] = ssids.map(ssid => ({
    ssid,
    password: '1234',
    isSecured: Math.random() > 0.33
}));

let connectedNetworkSSID: string = "";

const getFakeNetworks = () => delay().then(() => [...fixedNetworks]);

const getRemoteNetworks = () =>
    new Promise<Network[]>(result => {
        fetch("/networks").then(res => result(res.json()));
    });

export const getNetworks =
    API_TYPE === "MOCK" ? getFakeNetworks : getRemoteNetworks;

const getFakeNetworkConfig = () => delay().then(() => ({
    ssid: connectedNetworkSSID,
    password: Array.from(Array(4)).reduce(s => `${s}*`, ""),
    status: NetworkConnectionStatus.Connected,
    ip: "10.110.12.12",
    mac: "a4:17:31:4b:97:f1"
}));

const getRemoteNetworkConfig = () =>
    new Promise<NetworkConfig>(result => {
        fetch("/network-config").then(res => result(res.json()));
    });

export const getNetworkConfig =
    API_TYPE === "MOCK" ? getFakeNetworkConfig : getRemoteNetworkConfig;

const fakeConnectToNetwork = (ssid: string, password: string) => delay().then(() =>
    new Promise((res, rej) => {
        const networkCandidates = fixedNetworks.filter(n => n.ssid === ssid);
        if (networkCandidates.length !== 1) rej();

        const networkToConnect = networkCandidates[0];
        if (networkToConnect.isSecured && networkToConnect.password !== password)
            rej();

        connectedNetworkSSID = networkToConnect.ssid;
        res();
    }));

const remoteConnectToNetwork = (ssid: string, password: string) =>
    new Promise((res, rej) => {
        fetch("/network-connect", {
            method: "POST",
            body: JSON.stringify({ssid, password})
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 0) 
                    res();
                else 
                    rej();
            });
    });

export const connectToNetwork =
    API_TYPE === "MOCK" ? fakeConnectToNetwork : remoteConnectToNetwork;

const fakeDisconnectFromNetwork = () => delay().then(() => connectedNetworkSSID = "");

const remoteDisconnectFromNetwork = () =>
    new Promise((res, rej) => {
        fetch("/network-disconnect", {
            method: "POST",
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 1) 
                    res();
                else 
                    rej();
            });
    });

export const disconnectFromNetwork =
    API_TYPE === "MOCK" ? fakeDisconnectFromNetwork : remoteDisconnectFromNetwork;
