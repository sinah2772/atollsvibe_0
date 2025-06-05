import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Save, Send, Eye } from 'lucide-react';
import { ValidationField, StepData } from '../types/editor';
import FormValidationIndicator from './FormValidationIndicator';
import { AutoSaveStatus } from './AutoSaveStatus';

interface MultiStepFormProps {
  steps: StepData[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  onPreview: () => void;
  formData: Record<string, unknown>;
  language: 'en' | 'dv';
  saving: boolean;
  publishing: boolean;
  lastSaved?: Date | null;
  autoSaveEnabled?: boolean;
  children: React.ReactNode;
  validationErrors?: ValidationField[];
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  currentStep,
  onStepChange,
  onSave,
  onPublish,
  onPreview,
  formData,
  language,
  saving,
  publishing,
  lastSaved,
  autoSaveEnabled = true,
  children,
  validationErrors = []
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepValidation, setStepValidation] = useState<Record<number, ValidationField[]>>({});

  // Calculate completion status for each step
  useEffect(() => {
    const newCompletedSteps = new Set<number>();
    const newStepValidation: Record<number, ValidationField[]> = {};    steps.forEach((step, index) => {
      if (step.validation) {
        const validation = step.validation(formData);
        newStepValidation[index] = validation;
        
        // Step is completed if it's optional or all validations pass
        if (step.optional || validation.every((field: ValidationField) => field.valid)) {
          newCompletedSteps.add(index);
        }
      } else {
        // If no validation function, check if required fields have values
        const hasRequiredData = step.fields.some((field: string) => 
          formData[field] && formData[field] !== '' && formData[field] !== null
        );
        
        if (step.optional || hasRequiredData) {
          newCompletedSteps.add(index);
        }
      }
    });

    setCompletedSteps(newCompletedSteps);
    setStepValidation(newStepValidation);
  }, [formData, steps]);
  const canGoNext = currentStep < steps.length - 1;
  const canGoPrev = currentStep > 0;
  const currentStepData = steps[currentStep];
  const currentStepValidation = stepValidation[currentStep] || [];

  const handleNext = () => {
    if (canGoNext) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      onStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to any step
    onStepChange(stepIndex);
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex === currentStep) return 'current';
    if (completedSteps.has(stepIndex)) return 'completed';
    return 'pending';
  };

  const getStepIcon = (stepIndex: number, status: string) => {
    if (status === 'completed') {
      return <Check className="w-5 h-5 text-white" />;
    }
    return <span className="text-sm font-medium">{stepIndex + 1}</span>;
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 border-green-600 text-white';
      case 'current':
        return 'bg-blue-600 border-blue-600 text-white ring-2 ring-blue-200';
      case 'pending':
      default:
        return 'bg-white border-gray-300 text-gray-500';
    }
  };

  const canPublish = steps.filter(step => !step.optional).every((_, index) => completedSteps.has(index));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? 'އައު މަޝްހޫރެއް ލިޔުން' : 'Create New Article'}
          </h1>
          
          {/* Auto-save status */}          {autoSaveEnabled && (
            <AutoSaveStatus 
              lastSaveTime={lastSaved}
              isSaving={saving}
              language={language}
            />
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = true; // Allow navigation to any step
            
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${getStepClasses(status)}
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  `}
                  title={language === 'dv' ? step.title.dv : step.title.en}
                >
                  {getStepIcon(index, status)}
                </button>
                
                <div className={`ml-3 ${isClickable ? 'cursor-pointer' : ''}`} onClick={() => isClickable && handleStepClick(index)}>                  <p className={`text-sm font-medium text-gray-900 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? step.title.dv : step.title.en}
                  </p>
                  <p className={`text-xs text-gray-500 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
                    {language === 'dv' ? step.description.dv : step.description.en}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 mx-4 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">          <h2 className={`text-xl font-semibold text-gray-900 mb-2 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? currentStepData?.title.dv : currentStepData?.title.en}
          </h2>
          <p className={`text-gray-600 ${language === 'dv' ? 'thaana-waheed' : ''}`}>
            {language === 'dv' ? currentStepData?.description.dv : currentStepData?.description.en}
          </p>
        </div>

        {/* Step Validation */}
        {currentStepValidation.length > 0 && (
          <div className="mb-6">
            <FormValidationIndicator 
              fields={currentStepValidation}
              language={language}
            />
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {children}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${canGoPrev 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }
                ${language === 'dv' ? 'thaana-waheed' : ''}
              `}
            >
              <ChevronLeft className="w-4 h-4 mr-2 inline" />
              {language === 'dv' ? 'ކުރިއަށް' : 'Previous'}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Save Draft Button */}
            <button
              onClick={onSave}
              disabled={saving}
              className={`
                px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium 
                hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center space-x-2
                ${language === 'dv' ? 'thaana-waheed' : ''}
              `}
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{language === 'dv' ? 'ސޭވްކުރައްވާ' : 'Save Draft'}</span>
            </button>

            {/* Preview Button */}
            <button
              onClick={onPreview}
              className={`
                px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium 
                hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2
                ${language === 'dv' ? 'thaana-waheed' : ''}
              `}
            >
              <Eye className="w-4 h-4" />
              <span>{language === 'dv' ? 'ކުރީގައި ބައްލަވާ' : 'Preview'}</span>
            </button>

            {canGoNext ? (
              <button
                onClick={handleNext}
                className={`
                  px-4 py-2 bg-blue-600 text-white rounded-lg font-medium 
                  hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2
                  ${language === 'dv' ? 'thaana-waheed' : ''}
                `}
              >
                <span>{language === 'dv' ? 'ފަހަތަށް' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onPublish}
                disabled={publishing || !canPublish}
                className={`
                  px-6 py-2 bg-green-600 text-white rounded-lg font-medium 
                  hover:bg-green-700 transition-colors duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center space-x-2
                  ${language === 'dv' ? 'thaana-waheed' : ''}
                `}
              >
                {publishing ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{language === 'dv' ? 'ޝާއިޢުކުރައްވާ' : 'Publish'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overall Form Status */}
      {validationErrors.length > 0 && (
        <div className="mt-6">
          <FormValidationIndicator 
            fields={validationErrors}
            language={language}
          />
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
