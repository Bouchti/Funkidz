import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)] text-white shadow-lg'
                    : currentStep === step.number
                    ? 'bg-[var(--fun-purple)] text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`font-medium text-sm ${
                    currentStep >= step.number
                      ? 'text-[var(--fun-purple)]'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 mb-8">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentStep > step.number
                        ? 'w-full bg-gradient-to-r from-[var(--fun-orange)] to-[var(--fun-pink)]'
                        : 'w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
