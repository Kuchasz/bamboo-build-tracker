import React from 'preact';

interface Props{
    icon: string;
    label: string;
    state: boolean;
    onClick: () => void;
}

const getClassName = (state: boolean) => `material-icons ${state ? 'enabled' : 'disabled'}`;

export const AlarmConfigItemComponent = ({icon, label, state, onClick}: Props) => (<div onClick={onClick} className='alarm-config-item-component'>
    <i className={getClassName(state)}>{icon}</i>
    <label>{label}</label>
</div>);