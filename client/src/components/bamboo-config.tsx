import React from "preact";
import {
    NetworkConfig,
    getNetworkConfig,
    NetworkConnectionStatus
} from "../apis/networks";
import {
    BambooConfig,
    getBambooConfig,
    getBambooProjects,
    getBambooPlans,
    selectProject,
    selectPlan,
    connect
} from "../apis/bamboo";
import { DropDown } from "./drop-down";

interface Props {}

interface State {
    networkConfig: NetworkConfig;
    bambooConfig: BambooConfig;
    projects: string[];
    plans: string[];
}

export class BambooConfigComponent extends React.Component<Props, State> {
    bambooServerInput: Element | undefined;
    usernameInput: Element | undefined;
    passwordInput: Element | undefined;

    componentDidMount() {
        getNetworkConfig()
            .then(networkConfig => {
                this.setState({ networkConfig });
                return networkConfig.status !==
                    NetworkConnectionStatus.Connected
                    ? Promise.reject<undefined>(undefined)
                    : Promise.resolve();
            })
            .then(() => this._getBambooConfig());
    }

    _getBambooConfig() {
        getBambooConfig().then(bambooConfig => {
            this.setState({ bambooConfig });
            (this.bambooServerInput as HTMLInputElement).value =
                bambooConfig.url;
            (this.usernameInput as HTMLInputElement).value = bambooConfig.login;
            (this.passwordInput as HTMLInputElement).value =
                bambooConfig.password;

            if (bambooConfig.connected)
                getBambooProjects().then(projects => {
                    this.setState({ projects });
                });

            if (bambooConfig.connected && bambooConfig.project)
                getBambooPlans(bambooConfig.project).then(plans => {
                    this.setState({ plans });
                });
        });
    }

    onSelectProject(project: string) {
        selectProject(project).then(() => this._getBambooConfig());
    }

    onSelectPlan(plan: string) {
        selectPlan(plan).then(() => this._getBambooConfig());
    }

    updateUrl(url: string) {
        this.setState({
            bambooConfig: {
                ...this.state.bambooConfig,
                url
            }
        });
    }

    updateUsername(login: string) {
        this.setState({
            bambooConfig: {
                ...this.state.bambooConfig,
                login
            }
        });
    }

    updatePassword(password: string) {
        this.setState({
            bambooConfig: {
                ...this.state.bambooConfig,
                password
            }
        });
    }

    login() {
        const { url, password, login } = this.state.bambooConfig;
        connect(url, login, password).then(
            () => this._getBambooConfig(),
            () => console.log("wrong-login", url, login, password)
        );
    }

    render() {
        const { projects, plans, bambooConfig } = this.state;
        return (
            <div className="bamboo-config-component">
                {this.state.networkConfig ? (
                    <span>
                        <div>IP: {this.state.networkConfig.mac}</div>
                        <div>MAC: {this.state.networkConfig.ip}</div>
                    </span>
                ) : null}

                <div className="input-group">
                    <label>Bamboo server url</label>
                    <input
                        onKeyUp={e =>
                            this.updateUrl((e.target as HTMLInputElement).value)
                        }
                        ref={el => {
                            this.bambooServerInput = el;
                        }}
                    />
                </div>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        onKeyUp={e =>
                            this.updateUsername(
                                (e.target as HTMLInputElement).value
                            )
                        }
                        ref={el => {
                            this.usernameInput = el;
                        }}
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        onKeyUp={e =>
                            this.updatePassword(
                                (e.target as HTMLInputElement).value
                            )
                        }
                        ref={el => {
                            this.passwordInput = el;
                        }}
                    />
                </div>
                <div>
                    <button onClick={() => this.login()}>Login</button>
                </div>
                {bambooConfig && (
                    <div>
                        {projects && (
                            <DropDown
                                label="Select project"
                                options={projects}
                                selected={bambooConfig.project}
                                onChange={project =>
                                    this.onSelectProject(project)
                                }
                            />
                        )}
                        {plans &&
                            bambooConfig.project && (
                                <DropDown
                                    onChange={plan => this.onSelectPlan(plan)}
                                    label="Select plan"
                                    options={plans}
                                    selected={bambooConfig.plan}
                                />
                            )}
                    </div>
                )}
            </div>
        );
    }
}
