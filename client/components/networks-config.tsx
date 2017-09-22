import React from 'preact';
import {NetworkComponent} from "./network";
import {Network, getNetworks, connectToNetwork, getNetworkConfig} from "../apis/networks";

interface Props {

}

interface State {
    networks: Network[];
    connectedNetwork: string;
    selectedNetwork: string;
    password: string;
}

export class NetworksConfigComponent extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            networks: [],
            connectedNetwork: '',
            selectedNetwork: '',
            password: ''
        };
    }

    passwordInput: HTMLInputElement;

    componentDidMount() {
        getNetworks().then(networks => this.setState({networks}));
        getNetworkConfig().then((config) => {
            this.setState({
                password: config.password,
                selectedNetwork: config.ssid,
                connectedNetwork: config.ssid
            });
            this.passwordInput.value = config.password;
        });
    }

    selectNetwork(network: Network) {
        this.setState({selectedNetwork: network.ssid});
    }

    connectToNetwork() {
        connectToNetwork(this.state.selectedNetwork, this.state.password).then(() => this.setState({
            connectedNetwork: this.state.selectedNetwork
        }));
    }

    onTypePassword(e: Event) {
        this.setState({
            password: (e.target as any).value
        })
    }

    render() {
        return (<div className="networks-config-component">
            <div class="input-group">
                <label>password</label>
                <input ref={(el: HTMLInputElement) => this.passwordInput = el}
                       onChange={this.onTypePassword.bind(this)}></input>
            </div>
            <button onClick={this.connectToNetwork.bind(this)}>Connect</button>
            <div className="networks-list">
                {this.state.networks ? this.state.networks.map(n => (
                    <NetworkComponent
                        isConnected={n.ssid === this.state.connectedNetwork}
                        onSelect={() => this.selectNetwork(n)}
                        name={n.ssid}
                        isSecured={n.isSecured}/>)) : null}
            </div>
        </div>)
    }
}