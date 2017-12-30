import * as React from "preact";
import { MenuItems } from "./main";
import { Icon } from "./icon";
const AlarmIcon = require("../images/icons/ic_alarm_black_18px.svg");
const BuildIcon = require("../images/icons/ic_build_black_18px.svg");
const HomeIcon = require("../images/icons/ic_home_black_18px.svg");
const WifiIcon = require("../images/icons/ic_wifi_tethering_black_18px.svg");

interface Props {
    onMenuItemSelect: (menuItem: string) => void;
    selectedMenuItem: string;
}

const getMenuItemClass = (menuItem: string, selectedMenuItem: string) =>
    `${menuItem === selectedMenuItem ? "active" : ""} menu-item`;

export const FooterComponent = ({
    onMenuItemSelect,
    selectedMenuItem
}: Props) => (
    <footer>
        <Icon
            size={18}
            icon={HomeIcon}
            className={getMenuItemClass(MenuItems.Dashboard, selectedMenuItem)}
            onClick={() => onMenuItemSelect(MenuItems.Dashboard)}
        />
        <Icon
            size={18}
            icon={AlarmIcon}
            className={getMenuItemClass(
                MenuItems.AlarmConfig,
                selectedMenuItem
            )}
            onClick={() => onMenuItemSelect(MenuItems.AlarmConfig)}
        />
        <Icon
            size={18}
            icon={WifiIcon}
            className={getMenuItemClass(
                MenuItems.NetworkConfig,
                selectedMenuItem
            )}
            onClick={() => onMenuItemSelect(MenuItems.NetworkConfig)}
        />
        <Icon
            size={18}
            icon={BuildIcon}
            className={getMenuItemClass(
                MenuItems.BambooConfig,
                selectedMenuItem
            )}
            onClick={() => onMenuItemSelect(MenuItems.BambooConfig)}
        />
    </footer>
);
