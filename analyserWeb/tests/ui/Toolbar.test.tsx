import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Toolbar from '../../src/ui/Toolbar';

import { vi } from 'vitest'; // Import vi

describe('Toolbar', () => {
  it('renders the control buttons', () => {
    render(<Toolbar onViewStateChange={() => {}} />); // Pass mock function
    expect(screen.getByRole('button', { name: '<' })).toBeInTheDocument(); // Use exact text/title
    expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '^' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'v' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Z+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Z-' })).toBeInTheDocument();
  });
});
