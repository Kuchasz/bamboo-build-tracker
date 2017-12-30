import React from "preact";
import { AlarmConfigItemComponent } from "./alarm-config-item";
import {
    AlarmConfig,
    getAlarmConfig,
    toggleLight,
    toggleSignal
} from "../apis/alarm";

const LightBulb = require("../images/icons/ic_lightbulb_outline_black_18px.svg");
const VolumeUp = require("../images/icons/ic_volume_up_black_18px.svg");

interface Props {}

interface State {
    config: AlarmConfig;
}

export class AlarmConfigComponent extends React.Component<Props, State> {
    componentDidMount() {
        getAlarmConfig().then(config => this.setState({ config }));
    }

    toggleLight() {
        toggleLight().then(() => {
            this.setState({
                config: {
                    ...this.state.config,
                    lightState: !this.state.config.lightState
                }
            });
        });
    }
    toggleSignal() {
        toggleSignal().then(() => {
            this.setState({
                config: {
                    ...this.state.config,
                    signalState: !this.state.config.signalState
                }
            });
        });
    }

    render() {
        const { config } = this.state;
        return config ? (
            <div className="alarm-config-component">
                <AlarmConfigItemComponent
                    onClick={this.toggleLight.bind(this)}
                    state={config.lightState}
                    icon={LightBulb}
                    label="Light effects"
                />
                <AlarmConfigItemComponent
                    onClick={this.toggleSignal.bind(this)}
                    state={config.signalState}
                    icon={VolumeUp}
                    label="Sound effects"
                />
            </div>
        ) : null;
    }
}
