import React from 'preact';
import {NetworkComponent} from "./network";
import {Network, getNetworks, connectToNetwork} from "../apis/networks";

interface State {
    networks: Network[];
    connectedNetwork: string;
    selectedNetwork: string;
    password: string;
}

export class NetworksConfigComponent extends React.Component<any, State> {

    constructor(){
        super();
        this.state = {
            networks: [],
            connectedNetwork: '',
            selectedNetwork: '',
            password: ''
        };
    }

    findNetworks() {
        getNetworks().then(networks => this.setState({networks}));
    }

    selectNetwork(network: Network) {
        this.setState({selectedNetwork: network.ssid});
    }

    connectToNetwork(){
        connectToNetwork(this.state.selectedNetwork, this.state.password).then(()=>this.setState({
            connectedNetwork: this.state.selectedNetwork
        }));
    }

    onTypePassword(e: Event){
        this.setState({
            password: (e.target as any).value
        })
    }

    render() {
        return (<div className="networks-config-component">
            <button onClick={this.findNetworks.bind(this)}>Find networks</button>
            <div className="networks-list">
                {this.state.networks.map(n => (
                    <NetworkComponent
                        isConnected={n.ssid === this.state.connectedNetwork}
                        onSelect={() => this.selectNetwork(n)}
                        name={n.ssid}
                        isSecured={n.isSecured}/>))}
            </div>
            <div class="complex-input">
                <input onChange={this.onTypePassword.bind(this)} placeholder="password"></input>
                <button onClick={this.connectToNetwork.bind(this)}>Connect</button>
            </div>
        </div>)
    }
}