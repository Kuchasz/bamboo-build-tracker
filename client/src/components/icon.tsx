import * as React from 'preact';

export const Icon = ({icon, className, onClick, size}: {icon: string, className: string, onClick?: () => void, size: number}) => {
    return (<i onClick={onClick} className={className}>
        <svg fill="#000000" height={size} width={size} viewBox="0 0 24 24" dangerouslySetInnerHTML={{__html: icon}} xmlns="http://www.w3.org/2000/svg"/>
    </i>)
};