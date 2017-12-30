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

export const urls = {
    networks: "/networks",
    networkConfig: "/network-config",
    networkConnect: "/network-connect",
    networkDisconnect: "/network-disconnect"
};

export const getNetworks = () =>
    new Promise<Network[]>(result => {
        fetch(`${API_HOST}${urls.networks}`).then(res => result(res.json()));
    });

export const getNetworkConfig = () =>
    new Promise<NetworkConfig>(result => {
        fetch(`${API_HOST}${urls.networkConfig}`).then(res =>
            result(res.json())
        );
    });

export const connectToNetwork = (ssid: string, password: string) =>
    new Promise((res, rej) => {
        fetch(`${API_HOST}${urls.networkConnect}`, {
            method: "POST",
            body: JSON.stringify({ ssid, password }),
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 1) res();
                else rej();
            });
    });

export const disconnectFromNetwork = () =>
    new Promise((res, rej) => {
        fetch(`${API_HOST}${urls.networkDisconnect}`, {
            method: "POST",
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 1) res();
                else rej();
            });
    });
