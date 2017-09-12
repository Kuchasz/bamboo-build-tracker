import React from 'preact';
import {MenuItems} from "./main";

interface Props{
    onMenuItemSelect: (menuItem: string) => void;
    selectedMenuItem: string;
}

const getMenuItemClass = (menuItem: string, selectedMenuItem: string) => `${menuItem === selectedMenuItem ? 'active' : ''} menu-item material-icons`;

export const FooterComponent = ({onMenuItemSelect, selectedMenuItem}: Props) => (<footer>
    <i onClick={() => onMenuItemSelect(MenuItems.Dashboard)} className={getMenuItemClass(MenuItems.Dashboard, selectedMenuItem)}>home</i>
    <i onClick={() => onMenuItemSelect(MenuItems.AlarmConfig)} className={getMenuItemClass(MenuItems.AlarmConfig, selectedMenuItem)}>alarm</i>
    <i onClick={() => onMenuItemSelect(MenuItems.NetworkConfig)} className={getMenuItemClass(MenuItems.NetworkConfig, selectedMenuItem)}>wifi_tethering</i>
    <i onClick={() => onMenuItemSelect(MenuItems.BambooConfig)} className={getMenuItemClass(MenuItems.BambooConfig, selectedMenuItem)}>build</i>
</footer>);