export type Network = {
    ssid: string;
    isSecured: boolean;
}

type ServerSideNetwork = Network & {password?: string};

const fixedNetworks: ServerSideNetwork[] = [{
    ssid: 'Nania',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Marvel',
    isSecured: false
},{
    ssid: 'DC Comics',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Squirle',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Marcus figo',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Tora tora',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Szakawina',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Merlin',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Hellfire',
    isSecured: true,
    password: '1234'
},{
    ssid: 'GoldeN',
    isSecured: true,
    password: '1234'
},{
    ssid: 'Baoblir',
    isSecured: false
}];

let connectedNetworkSSID = "";

export const getNetworks = () => {
    return new Promise<Network[]>((res: ((value: Network[])=>void))=>{
        setTimeout(() => res(fixedNetworks), 250);
    });
};

export const getConnectedNetwork = () => connectedNetworkSSID;

export const connectToNetwork = (ssid: string, password: string) => new Promise((res, rej)=>{
    setTimeout(() => {
        const networkCandidates = fixedNetworks.filter(n => n.ssid === ssid);
        if(networkCandidates.length !== 1) rej();
        
        const networkToConnect = networkCandidates[0];
        if(networkToConnect.password && networkToConnect.password !== password) rej();
    
        connectedNetworkSSID = networkToConnect.ssid;
        res();
    }, 250);
});