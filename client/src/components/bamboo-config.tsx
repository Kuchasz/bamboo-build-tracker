import React from 'preact';
import { NetworkConfig, getNetworkConfig, NetworkConnectionStatus } from '../apis/networks';
import { BambooConfig, getBambooConfig, getBambooProjects, getBambooPlans, selectProject, selectPlan } from '../apis/bamboo';
import { DropDown } from './drop-down';

interface Props {

}

interface State {
    networkConfig: NetworkConfig;
    bambooConfig: BambooConfig;
    projects: string[];
    plans: string[];
}

export class BambooConfigComponent extends React.Component<Props, State>{

    bambooServerInput: Element | undefined;
    usernameInput: Element | undefined;
    passwordInput: Element | undefined;

    componentDidMount() {

        getNetworkConfig()
            .then(networkConfig => {
                this.setState({ networkConfig });
                return (networkConfig.status !== NetworkConnectionStatus.Connected)
                    ? Promise.reject<undefined>(undefined)
                    : Promise.resolve();
            }).then(this._getBambooConfig);

    }

    _getBambooConfig = () => {
        getBambooConfig()
            .then(bambooConfig => {
                this.setState({ bambooConfig });
                (this.bambooServerInput as HTMLInputElement).value = bambooConfig.url;
                (this.usernameInput as HTMLInputElement).value = bambooConfig.login;
                (this.passwordInput as HTMLInputElement).value = bambooConfig.password;

                (bambooConfig.connected) &&
                    getBambooProjects().then(projects => {
                        this.setState({ projects })
                    });
                (bambooConfig.connected && bambooConfig.project) &&
                    getBambooPlans(bambooConfig.project).then(plans => {
                        this.setState({ plans });
                    });
            });
    }

    onSelectProject = (project: string) => {
        selectProject(project);
        this._getBambooConfig();
    }

    onSelectPlan = (plan: string) => {
        selectPlan(plan);
    }

    render() {
        const { projects, plans, bambooConfig } = this.state;
        return (
            <div className="bamboo-config-component">
                {this.state.networkConfig
                    ? <span>
                        <div>IP: {this.state.networkConfig.mac}</div>
                        <div>MAC: {this.state.networkConfig.ip}</div>
                    </span>
                    : null}

                <div className="input-group">
                    <label>Bamboo server url</label>
                    <input ref={el => {this.bambooServerInput = el;}}></input>
                </div>
                <div className="input-group">
                    <label>Username</label>
                    <input ref={el => {this.usernameInput = el;}}></input>
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input ref={el => {this.passwordInput = el;}}></input>
                </div>
                <div>
                    <button>Login</button>
                </div>
                {bambooConfig &&
                    <div>
                        {projects &&
                            <DropDown
                                label="Select project"
                                options={projects}
                                selected={bambooConfig.project}
                                onChange={this.onSelectProject}
                            />}
                        {plans && bambooConfig.project &&
                            <DropDown
                                onChange={this.onSelectPlan}
                                label="Select plan"
                                options={plans}
                                selected={bambooConfig.plan}
                            />}
                    </div>}
            </div>);
    }
}