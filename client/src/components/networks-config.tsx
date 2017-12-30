import React from "preact";
import { NetworkComponent } from "./network";
import {
    Network,
    getNetworks,
    connectToNetwork,
    getNetworkConfig,
    disconnectFromNetwork
} from "../apis/networks";

interface Props {}

interface State {
    networks: Network[];
    connectedNetwork?: string;
    selectedNetwork?: string;
}

export class NetworksConfigComponent extends React.Component<Props, State> {
    private container?: Element;

    constructor() {
        super();
        this.state = {
            connectedNetwork: undefined,
            selectedNetwork: undefined,
            networks: []
        };
    }

    componentDidMount() {
        document.addEventListener(
            "click",
            e => this.handleClickOutside(e),
            true
        );
        getNetworks().then(networks => this.setState({ networks }));
        getNetworkConfig().then(config => {
            this.setState({
                connectedNetwork: config.ssid
            });
        });
    }

    componentWillUnmount() {
        document.removeEventListener(
            "click",
            e => this.handleClickOutside(e),
            true
        );
    }

    handleClickOutside(e: MouseEvent) {
        const el = this.container;
        if (el && !el.contains(e.target as Node)) this.unselectNetwork();
    }

    selectNetwork(network: Network) {
        this.setState({ selectedNetwork: network.ssid });
    }

    unselectNetwork() {
        this.setState({ selectedNetwork: undefined });
    }

    connectToNetwork(password: string) {
        this.state.selectedNetwork &&
            connectToNetwork(this.state.selectedNetwork, password).then(
                () =>
                    this.setState({
                        connectedNetwork: this.state.selectedNetwork,
                        selectedNetwork: undefined
                    }),
                () => {
                    this.setState({
                        connectedNetwork: undefined
                    });
                }
            );
    }

    disconnectFromNetwork() {
        disconnectFromNetwork().then(() =>
            this.setState({
                connectedNetwork: undefined,
                selectedNetwork: undefined
            })
        );
    }

    render() {
        return (
            <div className="networks-config-component">
                <div
                    className="networks-list"
                    ref={el => (this.container = el)}
                >
                    {this.state.networks
                        ? this.state.networks.map(n => (
                              <NetworkComponent
                                  isExpanded={
                                      n.ssid === this.state.selectedNetwork
                                  }
                                  onConnect={(password: string) =>
                                      this.connectToNetwork(password)
                                  }
                                  onDisconnect={() =>
                                      this.disconnectFromNetwork()
                                  }
                                  isConnected={
                                      n.ssid === this.state.connectedNetwork
                                  }
                                  onSelect={() => this.selectNetwork(n)}
                                  name={n.ssid}
                                  isSecured={n.isSecured}
                              />
                          ))
                        : null}
                </div>
            </div>
        );
    }
}
