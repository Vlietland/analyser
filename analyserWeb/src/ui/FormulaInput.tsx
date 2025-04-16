import React, { ChangeEvent } from 'react';

interface FormulaInputProps {
  value: string;
  onChange: (newValue: string) => void;
}

function FormulaInput({ value, onChange }: FormulaInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Enter formula z = f(x, y)"
      value={value}
      onChange={handleChange}
      style={{ marginRight: '10px', padding: '5px' }}
    />
  );
}

export default FormulaInput;
