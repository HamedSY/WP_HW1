document.addEventListener('DOMContentLoaded', function() {
    class FormulaEvaluator {
        constructor() {
            this.formulaElements = document.querySelectorAll('formula');
            this.inputElements = document.querySelectorAll('input[type="number"]');
            this.setupEventListeners();
            this.evaluateAllFormulas();
        }

        setupEventListeners() {
            this.inputElements.forEach(input => {
                input.addEventListener('input', () => this.evaluateAllFormulas());
            });
        }

        evaluateAllFormulas() {
            this.formulaElements.forEach(formulaElement => {
                this.evaluateFormula(formulaElement);
            });
        }

        evaluateFormula(formulaElement) {
            const formula = formulaElement.getAttribute('evaluator');
            if (!formula) {
                formulaElement.textContent = 'No formula specified';
                return;
            }

            try {
                const context = {};
                this.inputElements.forEach(input => {
                    const value = parseFloat(input.value) || 0;
                    context[input.id] = value;
                });

                const result = this.safeEval(formula, context);
                formulaElement.textContent = result;
            } catch (error) {
                console.error('Error evaluating formula:', error);
                formulaElement.textContent = 'Invalid Formula';
            }
        }

        safeEval(expression, context) {
            const replaced = expression.replace(/[a-zA-Z_$][a-zA-Z0-9_$]*/g, match => {
                return context.hasOwnProperty(match) ? context[match] : match;
            });
            const result = Function('"use strict";return (' + replaced + ')')();
            return Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
        }
    }

    // Initialize the evaluator
    new FormulaEvaluator();
});