import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CanvasViewport from '../../src/ui/CanvasViewport';
import { DEFAULT_VIEW_STATE } from '../../src/core/transform/viewState';

vi.mock('../../src/renderer/sceneBuilder', () => ({ buildScene: vi.fn(() => ({ scene: {}, camera: {}, renderer: { dispose: vi.fn() } })) }));
vi.mock('../../src/renderer/surfaceRenderer', () => ({ renderSurface: vi.fn() }));
vi.mock('../../src/renderer/rendererState', () => ({ setupRenderer: vi.fn(() => vi.fn()), updateCamera: vi.fn() }));


describe('CanvasViewport', () => {
  it('renders a canvas element', () => {
    render(<CanvasViewport gridData={null} viewState={DEFAULT_VIEW_STATE} />);
    const canvasElement = screen.getByRole('graphics-document', { hidden: true }); // Role might vary, adjust if needed
    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement.tagName).toBe('CANVAS');
  });
  
});
