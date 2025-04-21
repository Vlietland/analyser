import { create, all, MathNode, ParseOptions } from 'mathjs';

export interface ParseError {
  readonly input: string;
  readonly message: string;
  readonly type?: string;
}

export type CompilationResult = boolean | ParseError;

export class ExpressionParser {
  private static math = create(all);
  private static PARSE_OPTIONS: ParseOptions = {};
  private static compiledNode: any = null;
  private static compiledInput: string = '';

  // Compile the expression and store it in compiledNode
  public static compileExpression(input: string): CompilationResult {
    if (!input || input.trim() === '') {
      return {
        input,
        message: 'Expression cannot be empty.',
        type: 'ValidationError'
      };
    }

    try {
      const node: MathNode = this.math.parse(input, this.PARSE_OPTIONS);

      if (node.type === 'AssignmentNode' || 
          (node.type === 'SymbolNode' && input.trim() === node.name)) {
        throw new Error('Expression must evaluate to a value, not an assignment or a symbol.');
      }

      this.compiledNode = node.compile();  // Store the compiled expression
      this.compiledInput = input;
      return true;
    } catch (parseError: unknown) {
      this.compiledNode = null;
      this.compiledInput = '';

      const errorResult: ParseError = {
        input,
        message: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
        type: parseError instanceof SyntaxError ? 'SyntaxError' : 'ParseError'
      };
      return errorResult;
    }
  }

  public static evaluateExpression(scope: Record<string, number>): number {
    if (!this.compiledNode) {
      throw new Error('No expression has been compiled. Call compileExpression first.');
    }

    try {
      const result = this.compiledNode.evaluate(scope);
      if (typeof result !== 'number' || !Number.isFinite(result)) {
        throw new Error(`Evaluation resulted in non-finite number: ${result}`);
      }
      return result;
    } catch (evalError: unknown) {
      throw new Error(`Evaluation error: ${evalError instanceof Error ? evalError.message : String(evalError)}`);
    }
  }

  public static isCompilationSuccessful(result: CompilationResult): result is boolean {
    return typeof result === 'boolean' && result === true;
  }

  public static isParseError(result: CompilationResult): result is ParseError {
    return typeof result === 'object' && (result as ParseError).message !== undefined;
  }
}
