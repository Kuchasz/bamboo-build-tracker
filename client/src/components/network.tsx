import React from "preact";
import { Icon } from "./icon";

const SecurecIcon = require("../images/icons/ic_signal_wifi_4_bar_black_24px.svg");
const OpenIcon = require("../images/icons/ic_signal_wifi_4_bar_lock_black_24px.svg");

interface Props {
  name: string;
  isSecured: boolean;
  isConnected: boolean;
  onDisconnect: () => void;
  onConnect: (password: string) => void;
  onSelect: () => void;
  isExpanded: boolean;
}

interface State {
  password: string;
}

export class NetworkComponent extends React.Component<Props, State> {
  updatePassword(password: string) {
    this.setState({ password });
  }

  render() {
    const {
      onSelect,
      name,
      isSecured,
      isConnected,
      isExpanded,
      onConnect,
      onDisconnect
    } = this.props;
    return (
      <span onClick={onSelect}  onBlur={()=>console.log('bluR!!')} className="network-component">
        <div className="network-info">
          <Icon size={18} icon={isSecured ? SecurecIcon : OpenIcon} />
          <div>
            <div className="network-name">{name}</div>
            <div className="network-status">
              {isConnected ? "Connected, " : null}
              {isSecured ? "Secured" : "Open"}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <span className="network-actions">
            {isConnected ? (
              <div>
                <button onClick={onDisconnect}>Disconnect</button>
              </div>
            ) : (
              <div>
                <button onClick={() => onConnect(this.state.password)}>
                  Connect
                </button>
                {isSecured ? (
                  <div class="input-group">
                    <label>Password</label>
                    <input
                      onKeyUp={e => this.updatePassword((e.target as HTMLInputElement).value)}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </span>
        ) : null}
      </span>
    );
  }
}
