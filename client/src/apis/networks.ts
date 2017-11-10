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
    ip: string;
    mac: string;
}

// type ServerSideNetwork = Network & { password?: string };

// const fixedNetworks: ServerSideNetwork[] = [{
//     ssid: 'Nania',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Marvel',
//     isSecured: false
// }, {
//     ssid: 'DC Comics',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Squirle',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Marcus figo',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Tora tora',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Szakawina',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Merlin',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Hellfire',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'GoldeN',
//     isSecured: true,
//     password: '1234'
// }, {
//     ssid: 'Baoblir',
//     isSecured: false
// }];

// let connectedNetworkSSID: string;

// export const getNetworks = () => {
//     return new Promise<Network[]>((res: ((value: Network[]) => void)) => {
//         setTimeout(() => res(fixedNetworks), 250);
//     });
// };

export const getNetworks = () => new Promise<Network[]>(result => {
    fetch('/networks').then(res => result(res.json()));
});

// export const getNetworkConfig = () => new Promise<NetworkConfig>(res=>{
//     setTimeout(()=>{
//         res({
//             ssid: 'Szakawina',
//             password: Array.from(Array(4)).reduce(s => `${s}*`, ''),
//             status: NetworkConnectionStatus.Connected,
//             ip: '10.110.12.12',
//             mac: 'a4:17:31:4b:97:f1'
//         });
//     }, 250);
// });

export const getNetworkConfig = () => new Promise<NetworkConfig>(result => {
    fetch('/network-config').then(res => result(res.json()))
});

// export const connectToNetwork = (ssid: string, password: string) => new Promise((res, rej) => {
//     setTimeout(() => {
//         const networkCandidates = fixedNetworks.filter(n => n.ssid === ssid);
//         if (networkCandidates.length !== 1) rej();
//
//         const networkToConnect = networkCandidates[0];
//         if (networkToConnect.password && networkToConnect.password !== password) rej();
//
//         // connectedNetworkSSID = networkToConnect.ssid;
//         res();
//     }, 250);
// });

export const connectToNetwork = (ssid: string, password: string) => new Promise((res, rej) => {
    fetch('/network-connect', {
        method: "POST",
        body: JSON.stringify({ssid, password})
    }).then(response => response.json()).then(response => {
        if (response.result == 0)
            res();
        else
            rej();
    })
});

// export const disconnectFromNetwork = () => new Promise((res) => {
//     setTimeout(() => res(), 250);
// });

export const disconnectFromNetwork = () => new Promise((res, rej) => {
    fetch('/network-disconnect', {method: "POST"})
        .then(response => response.json()).then(response => {
        if (response.result == 0)
            res();
        else
            rej();
    })
});