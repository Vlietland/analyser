import { describe, it, expect } from 'vitest';
import { compileExpression } from '../../../src/core/evaluator/expressionEngine';
import { isCompiledExpression, isParseError } from '../../../src/core/evaluator/expressionTypes';

describe('compileExpression', () => {
  it('should compile a valid expression', () => {
    const result = compileExpression('x^2 + y');
    expect(isCompiledExpression(result)).toBe(true);
    if (isCompiledExpression(result)) {
      expect(result.input).toBe('x^2 + y');
      expect(result.node).toBeDefined();
      expect(typeof result.evaluate).toBe('function');
    }
  });

  it('should evaluate a compiled expression correctly', () => {
    const result = compileExpression('x * y + 2');
    expect(isCompiledExpression(result)).toBe(true);
    if (isCompiledExpression(result)) {
      expect(result.evaluate({ x: 3, y: 4 })).toBe(14);
      expect(result.evaluate({ x: -1, y: 5 })).toBe(-3);
    }
  });

  it('should return ParseError for invalid syntax', () => {
    const result = compileExpression('sin(x');
    expect(isParseError(result)).toBe(true);
    if (isParseError(result)) {
      expect(result.input).toBe('sin(x');
      expect(result.message).toContain('Parenthesis ) expected');
      expect(result.type).toBe('SyntaxError');
    }
  });

  it('should return ParseError for empty input', () => {
    const result = compileExpression('');
    expect(isParseError(result)).toBe(true);
    if (isParseError(result)) {
      expect(result.input).toBe('');
      expect(result.message).toBe('Expression cannot be empty.');
      expect(result.type).toBe('ValidationError');
    }
  });

   it('should return ParseError for whitespace input', () => {
    const result = compileExpression('   ');
    expect(isParseError(result)).toBe(true);
    if (isParseError(result)) {
      expect(result.input).toBe('   ');
      expect(result.message).toBe('Expression cannot be empty.');
      expect(result.type).toBe('ValidationError');
    }
  });

  it('should return ParseError for assignment expressions', () => {
    const result = compileExpression('a = 5');
    expect(isParseError(result)).toBe(true);
    if (isParseError(result)) {
      expect(result.message).toContain('Expression must evaluate to a value');
    }
  });

  it('should return ParseError for symbol expressions', () => {
    const result = compileExpression('justAVariable');
     expect(isParseError(result)).toBe(true);
    if (isParseError(result)) {
       expect(result.message).toContain('Expression must evaluate to a value');
    }
  });

  it('should throw error during evaluation for undefined variables', () => {
    const result = compileExpression('x + y');
    expect(isCompiledExpression(result)).toBe(true);
    if (isCompiledExpression(result)) {
      expect(() => result.evaluate({ x: 1 })).toThrow(/Evaluation error: Undefined symbol y/);
    }
  });

   it('should throw error during evaluation for non-finite results', () => {
    const result = compileExpression('1/0');
    expect(isCompiledExpression(result)).toBe(true);
    if (isCompiledExpression(result)) {
      expect(() => result.evaluate({})).toThrow(/Evaluation resulted in non-finite number: Infinity/);
    }
  });
});
