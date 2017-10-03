import React from 'preact';
import { NetworkConfig, getNetworkConfig, NetworkConnectionStatus } from '../apis/networks';
import { BambooConfig, getBambooConfig, getBambooProjects, getBambooPlans, selectProject, selectPlan } from '../apis/bamboo';

interface Props{

}

interface State{
    networkConfig: NetworkConfig;
    bambooConfig: BambooConfig;
    projects: string[];
    plans: string[];
}

export class BambooConfigComponent extends React.Component<Props, State>{
    
    bambooServerInput: HTMLInputElement;
    usernameInput: HTMLInputElement;
    passwordInput: HTMLInputElement;

    componentDidMount(){

        getNetworkConfig()
            .then(networkConfig => {
                this.setState({networkConfig});
                return (networkConfig.status !== NetworkConnectionStatus.Connected) 
                    ? Promise.reject<undefined>(undefined)
                    : Promise.resolve();
        }).then(this._getBambooConfig.bind(this));

    }

    _getBambooConfig(){
        getBambooConfig()
            .then(bambooConfig => {
                this.setState({bambooConfig});
                this.bambooServerInput.value = bambooConfig.url;
                this.usernameInput.value = bambooConfig.login;
                this.passwordInput.value = bambooConfig.password;

                (bambooConfig.connected) &&
                    getBambooProjects().then(projects => {
                        this.setState({projects})
                    });
                (bambooConfig.connected && bambooConfig.project) &&
                    getBambooPlans(bambooConfig.project).then(plans=>{
                        this.setState({plans});
                    });
            });
    }
    
    onSelectProject(event: any){
        selectProject(event.target.value);
        this._getBambooConfig();
    }

    onSelectPlan(event: any){
        selectPlan(event.target.value);
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
                    <input ref={(el: HTMLInputElement) => this.bambooServerInput = el}></input>
                </div>
                <div class="input-group">
                    <label>Username</label>
                    <input ref={(el: HTMLInputElement) => this.usernameInput = el}></input>
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input ref={(el: HTMLInputElement) => this.passwordInput = el}></input>
                </div>
                <div>
                    <button>Login</button>
                </div>
                {this.state.bambooConfig ? <div>
                    {this.state.projects ? <select onChange={this.onSelectProject.bind(this)} placeholder="">
                        <option value="">Select project</option>
                        {this.state.projects.map(p => <option value={p} selected={p===this.state.bambooConfig.project}>{p}</option>)}
                        </select> : null}
                    {this.state.plans && this.state.bambooConfig.project ? <select onChange={this.onSelectPlan.bind(this)} placeholder="">
                        <option value="">Select plan</option>
                        {this.state.plans.map(p => <option value={p} selected={p===this.state.bambooConfig.plan}>{p}</option>)}
                        </select> : null}
                    </div> : null}
                    
            </div>);
    }
}