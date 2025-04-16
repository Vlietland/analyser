import { create, all, MathNode, ParseOptions } from 'mathjs';
import { CompilationResult, CompiledExpression, ParseError, isCompiledExpression } from './expressionTypes';

const math = create(all);

const PARSE_OPTIONS: ParseOptions = {};

export function compileExpression(input: string): CompilationResult {
  if (!input || input.trim() === '') {
    return {
      input,
      message: 'Expression cannot be empty.',
      type: 'ValidationError'
    };
  }
  try {
    const node: MathNode = math.parse(input, PARSE_OPTIONS);
    if (node.type === 'AssignmentNode' || node.type === 'SymbolNode') {
       throw new Error('Expression must evaluate to a value, not an assignment or a symbol.');
    }
    const compiledNode = node.compile();
    const compiledExpression: CompiledExpression = {
      input,
      node,
      evaluate: (scope: Record<string, number>): number => {
        try {
          const result = compiledNode.evaluate(scope);
          if (typeof result !== 'number' || !Number.isFinite(result)) {
            throw new Error(`Evaluation resulted in non-finite number: ${result}`);
          }
          return result;
        } catch (evalError: unknown) {
          throw new Error(`Evaluation error: ${evalError instanceof Error ? evalError.message : String(evalError)}`);
        }
      }
    };
    return compiledExpression;
  } catch (parseError: unknown) {
    const errorResult: ParseError = {
      input,
      message: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
      type: parseError instanceof SyntaxError ? 'SyntaxError' : 'ParseError'
    };
    return errorResult;
  }
}
