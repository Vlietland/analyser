import { FormulaInput } from '@src/ui/formulaInput';
import { ExpressionParser } from '@src/core/expressionParser';
import { GridGenerator } from '@src/core/gridGenerator';

export class App {
  private formulaInput: FormulaInput;

  constructor() {
    this.formulaInput = new FormulaInput();

    this.formulaInput.onChange((value) => {
      console.log('Formula changed:', value);
      const compilationResult = ExpressionParser.compileExpression(value);
      if (ExpressionParser.isParseError(compilationResult)) {
        console.log('Parse Error:', compilationResult.message);
        return;
      }
      try {
        const scope = { x: 3, y: 4 };
        const evaluationResult = ExpressionParser.evaluateExpression(scope);
        console.log('Evaluation Result:', evaluationResult);
        
        const surfaceGrid = GridGenerator.generateGrid(undefined, undefined);
        console.log('Surface Grid:', surfaceGrid);
      } catch (error) {
        console.error('Evaluation Error:', error instanceof Error ? error.message : String(error));
      }
    });

    document.body.appendChild(this.formulaInput.getElement());
  }
}

export function initApp(): void {
  new App();
}
