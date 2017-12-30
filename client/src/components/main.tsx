import React from "preact";
import { HeaderComponent } from "./header-component";
import { FooterComponent } from "./footer-component";
import { AlarmConfigComponent } from "./alarm-config";
import { BambooConfigComponent } from "./bamboo-config";
import { NetworksConfigComponent } from "./networks-config";
import { DashboardComponent } from "./dashboard";

export const MenuItems = {
    Dashboard: "dashboard",
    BambooConfig: "bamboo-config",
    AlarmConfig: "alarm-config",
    NetworkConfig: "network-config"
};

interface Props {}

interface State {
    selectedMenuItem: string;
}

export const getComponentFromMenuItem = (menuItem: string) => {
    if (menuItem === MenuItems.Dashboard) return DashboardComponent;
    if (menuItem === MenuItems.AlarmConfig) return AlarmConfigComponent;
    if (menuItem === MenuItems.BambooConfig) return BambooConfigComponent;
    if (menuItem === MenuItems.NetworkConfig) return NetworksConfigComponent;
    throw new Error(`${menuItem} has no component defined`);
};

export class MainComponent extends React.Component<Props, State> {
    constructor() {
        super();
        this.state.selectedMenuItem = MenuItems.Dashboard;
    }
    selectMenuItem(itemToSelect: string) {
        this.setState({ selectedMenuItem: itemToSelect });
    }
    render() {
        const ContentComponent = getComponentFromMenuItem(
            this.state.selectedMenuItem
        );
        return (
            <div class="main-component">
                <HeaderComponent />
                <section>
                    <ContentComponent />
                </section>
                <FooterComponent
                    selectedMenuItem={this.state.selectedMenuItem}
                    onMenuItemSelect={(item: string) =>
                        this.selectMenuItem(item)
                    }
                />
            </div>
        );
    }
}
