import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormulaInput from '../../src/ui/FormulaInput';

describe('FormulaInput', () => {
  it('renders the input field', () => {
    render(<FormulaInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/Enter formula z = f\(x, y\)/i)).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<FormulaInput value="x^2" onChange={() => {}} />);
    expect(screen.getByDisplayValue('x^2')).toBeInTheDocument();
  });

  it('calls onChange when the input value changes', () => {
    const handleChange = vi.fn();
    render(<FormulaInput value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/Enter formula z = f\(x, y\)/i);
    fireEvent.change(input, { target: { value: 'sin(x)' } });
    expect(handleChange).toHaveBeenCalledWith('sin(x)');
  });
});
