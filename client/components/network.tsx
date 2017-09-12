import React from 'preact';

interface Props {
    name: string,
    isSecured: boolean,
    isConnected: boolean,
    onSelect: () => void
}

export const NetworkComponent = ({name, isSecured, isConnected, onSelect}: Props) => (
    <span onClick={onSelect} className={`network-component ${isConnected ? 'connected' : ''}`}>
    <i class="material-icons">{isSecured ? 'signal_wifi_4_bar_lock' : 'signal_wifi_4_bar'}</i>
    <span>{name}</span>
</span>);