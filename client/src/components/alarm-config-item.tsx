import React from "preact";
import { Icon } from "./icon";

interface Props {
    icon: string;
    label: string;
    state: boolean;
    onClick: () => void;
}

const getClassName = (state: boolean) =>
    `material-icons ${state ? "enabled" : "disabled"}`;

export const AlarmConfigItemComponent = ({
    icon,
    label,
    state,
    onClick
}: Props) => (
    <div onClick={onClick} className="alarm-config-item-component">
        <Icon size={24} icon={icon} className={getClassName(state)} />
        <label>{label}</label>
    </div>
);
