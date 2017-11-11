import * as React from 'preact';

export const Icon = ({icon, className, onClick}: {icon: string, className: string, onClick?: () => void}) => {
    return (<i onClick={onClick} className={className} dangerouslySetInnerHTML={{__html: icon}}/>)
};