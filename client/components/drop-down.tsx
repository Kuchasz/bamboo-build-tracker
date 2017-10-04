import React from 'preact';

type DropDownProps = {
  options: string[];
  selected: string;
  label: string;
  onChange: (option: string) => void;
}
export const DropDown = ({ options, selected, label, onChange }: DropDownProps) =>
  <select onChange={e => onChange((e.target as any).value)} placeholder="">
    <option value="">{label}</option>
    {options.map(option =>
      <option
        value={option}
        selected={option === selected}>{option}
      </option>)}
  </select>