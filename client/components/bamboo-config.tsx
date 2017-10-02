import React from 'preact';
import { NetworkConfig, getNetworkConfig } from '../apis/networks';

interface Props{

}

interface State{
    networkConfig: NetworkConfig;
}

export class BambooConfigComponent extends React.Component<Props, State>{
    
    componentDidMount(){
        getNetworkConfig().then(networkConfig => this.setState({
            networkConfig
        }));
    }
    
    render(){
        return (
            <div class="bamboo-config-component">
                {this.state.networkConfig 
                    ? <span>
                        <div>IP: {this.state.networkConfig.mac}</div>
                        <div>MAC: {this.state.networkConfig.ip}</div>
                    </span>
                    : null }
                
                <div class="input-group">
                    <label>Bamboo server url</label>
                    <input></input>
                </div>
                <div class="input-group">
                    <label>Username</label>
                    <input></input>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input></input>
                </div>
                <div>
                    <button>Login</button>
                </div>
            </div>);
    }
}