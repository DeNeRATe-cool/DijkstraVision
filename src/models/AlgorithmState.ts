interface Step {
    currentNode?: number;
    visitedNodes: Set<number>;
    distances: Map<number, number>;
    previousNodes: Map<number, number>;
    description: string;
}

class AlgorithmState {
    private steps: Step[];
    private currentStep: number;

    constructor() {
        this.steps = [];
        this.currentStep = -1;
    }

    addStep(step: Step): void {
        this.steps.push({...step});
        this.currentStep++;
    }

    getCurrentStep(): Step | null {
        return this.currentStep >= 0 ? this.steps[this.currentStep] : null;
    }

    nextStep(): Step | null {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            return this.steps[this.currentStep];
        }
        return null;
    }

    previousStep(): Step | null {
        if (this.currentStep > 0) {
            this.currentStep--;
            return this.steps[this.currentStep];
        }
        return null;
    }

    reset(): void {
        this.currentStep = 0;
    }
}

export default AlgorithmState;
export type { Step }; 