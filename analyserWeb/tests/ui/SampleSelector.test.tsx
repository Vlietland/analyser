import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SampleSelector from '../../src/ui/SampleSelector';
import { MIN_SAMPLES, MAX_SAMPLES } from '../../src/core/grid/gridCalculator';

describe('SampleSelector', () => {
  it('renders the input field with correct attributes', () => {
    render(<SampleSelector value={50} onChange={() => {}} />);
    const input = screen.getByTitle(`Samples (${MIN_SAMPLES}-${MAX_SAMPLES})`);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', String(MIN_SAMPLES));
    expect(input).toHaveAttribute('max', String(MAX_SAMPLES));
  });

  it('displays the current value', () => {
    render(<SampleSelector value={75} onChange={() => {}} />);
    expect(screen.getByDisplayValue('75')).toBeInTheDocument();
  });

  it('calls onChange with the new value when changed', () => {
    const handleChange = vi.fn();
    render(<SampleSelector value={50} onChange={handleChange} />);
    const input = screen.getByTitle(`Samples (${MIN_SAMPLES}-${MAX_SAMPLES})`);
    fireEvent.change(input, { target: { value: '100' } });
    expect(handleChange).toHaveBeenCalledWith(100);
  });

  it('calls onChange with clamped value if input exceeds max', () => {
    const handleChange = vi.fn();
    render(<SampleSelector value={50} onChange={handleChange} />);
    const input = screen.getByTitle(`Samples (${MIN_SAMPLES}-${MAX_SAMPLES})`);
    fireEvent.change(input, { target: { value: String(MAX_SAMPLES + 50) } });
    expect(handleChange).toHaveBeenCalledWith(MAX_SAMPLES);
  });

  it('calls onChange with clamped value if input is below min', () => {
    const handleChange = vi.fn();
    render(<SampleSelector value={50} onChange={handleChange} />);
    const input = screen.getByTitle(`Samples (${MIN_SAMPLES}-${MAX_SAMPLES})`);
    fireEvent.change(input, { target: { value: String(MIN_SAMPLES - 1) } });
    expect(handleChange).toHaveBeenCalledWith(MIN_SAMPLES);
  });

   it('calls onChange with min value if input is cleared', () => {
    const handleChange = vi.fn();
    render(<SampleSelector value={50} onChange={handleChange} />);
    const input = screen.getByTitle(`Samples (${MIN_SAMPLES}-${MAX_SAMPLES})`);
    fireEvent.change(input, { target: { value: '' } });
    expect(handleChange).toHaveBeenCalledWith(MIN_SAMPLES); // Based on current implementation
  });
});
