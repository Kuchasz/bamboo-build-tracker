import React from "preact";

type DropDownProps = {
    options: { value: string; name: string }[];
    selected: string;
    label: string;
    onChange: (option: string) => void;
};
export const DropDown = ({
    options,
    selected,
    label,
    onChange
}: DropDownProps) => (
    <select
        onChange={e => onChange((e.target as HTMLSelectElement).value)}
        placeholder=""
    >
        <option value="">{label}</option>
        {options.map(option => (
            <option value={option.value} selected={option.value === selected}>
                {option.name}
            </option>
        ))}
    </select>
);
