import React from 'react';
import { MIN_SAMPLES, MAX_SAMPLES } from '../core/grid/gridCalculator'; // Import constants

interface SampleSelectorProps {
  value: number;
  onChange: (newValue: number) => void;
}

function SampleSelector({ value, onChange }: SampleSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(event.target.value, 10);
    if (!isNaN(numValue)) {
        // Clamp value within allowed range before calling onChange
        const clampedValue = Math.max(MIN_SAMPLES, Math.min(MAX_SAMPLES, numValue));
        onChange(clampedValue);
    } else if (event.target.value === '') {
        // Allow clearing the input, maybe default to MIN_SAMPLES or handle upstream
        onChange(MIN_SAMPLES); // Or handle empty state appropriately
    }
  };

  return (
    <input
      type="number"
      title={`Samples (${MIN_SAMPLES}-${MAX_SAMPLES})`} // Use title for hint
      value={value}
      onChange={handleChange}
      min={MIN_SAMPLES}
      max={MAX_SAMPLES}
      step={1}
      style={{ width: '80px', padding: '5px' }}
    />
  );
}

export default SampleSelector;
