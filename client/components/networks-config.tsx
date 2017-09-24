import React from 'preact';
import {NetworkComponent} from "./network";
import {Network, getNetworks, connectToNetwork, getNetworkConfig, disconnectFromNetwork} from "../apis/networks";

interface Props {

}

interface State {
    networks: Network[];
    connectedNetwork?: string;
    selectedNetwork?: string;
}

export class NetworksConfigComponent extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            networks: []
        };
    }

    componentDidMount() {
        getNetworks().then(networks => this.setState({networks}));
        getNetworkConfig().then((config) => {
            this.setState({
                connectedNetwork: config.ssid
            });
        });
    }

    selectNetwork(network: Network) {
        this.setState({selectedNetwork: network.ssid});
    }

    connectToNetwork(password: string) {
        this.state.selectedNetwork && connectToNetwork(this.state.selectedNetwork, password).then(() => this.setState({
            connectedNetwork: this.state.selectedNetwork
        }));
    }

    disconnectFromNetwork() {
        disconnectFromNetwork().then(() => this.setState({
            connectedNetwork: undefined,
            selectedNetwork: undefined
        }));
    }

    render() {
        return (<div className="networks-config-component">
            <div className="networks-list">
                {this.state.networks ? this.state.networks.map(n => (
                    <NetworkComponent
                        isExpanded={n.ssid === this.state.selectedNetwork}
                        onConnect={(password: string) => this.connectToNetwork(password)}
                        onDisconnect={() => this.disconnectFromNetwork()}
                        isConnected={n.ssid === this.state.connectedNetwork}
                        onSelect={() => this.selectNetwork(n)}
                        name={n.ssid}
                        isSecured={n.isSecured}/>)) : null}
            </div>
        </div>)
    }
}