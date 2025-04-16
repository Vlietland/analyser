import { MathNode } from 'mathjs';

export interface CompiledExpression {
  readonly input: string;
  readonly node: MathNode;
  evaluate: (scope: Record<string, number>) => number;
}

export interface ParseError {
  readonly input: string;
  readonly message: string;
  readonly type?: string;
}

export type CompilationResult = CompiledExpression | ParseError;

export function isCompiledExpression(result: CompilationResult): result is CompiledExpression {
  return (result as CompiledExpression).node !== undefined;
}

export function isParseError(result: CompilationResult): result is ParseError {
  return (result as ParseError).message !== undefined && (result as CompiledExpression).node === undefined;
}
