import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from './Icons';

// Step Components
import PersonalInfoStep from '../steps/PersonalInfoStep';
import ContactInfoStep from '../steps/ContactInfoStep';
import PreferencesStep from '../steps/PreferencesStep';
import ReviewStep from '../steps/ReviewStep';

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    component: PersonalInfoStep
  },
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'How can we reach you?',
    component: ContactInfoStep
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Customize your experience',
    component: PreferencesStep
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Confirm your information',
    component: ReviewStep
  }
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      country: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    },
    preferences: {
      interests: [],
      communication: [],
      newsletter: false,
      marketing: false,
      profilePublic: false,
      dataSharing: false
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
    
    // Clear section errors when user updates data
    const sectionErrors = Object.keys(errors).filter(key => key.startsWith(section));
    if (sectionErrors.length > 0) {
      const newErrors = { ...errors };
      sectionErrors.forEach(key => delete newErrors[key]);
      setErrors(newErrors);
    }
  };
  const validateStep = (stepIndex) => {
    const stepErrors = {};
    
    switch (stepIndex) {
      case 0: // Personal Info
        if (!formData.personalInfo.firstName.trim()) {
          stepErrors.firstName = 'First name is required';
        }
        if (!formData.personalInfo.lastName.trim()) {
          stepErrors.lastName = 'Last name is required';
        }
        if (!formData.personalInfo.dateOfBirth) {
          stepErrors.dateOfBirth = 'Date of birth is required';
        }
        if (!formData.personalInfo.gender) {
          stepErrors.gender = 'Gender is required';
        }
        break;
        
      case 1: // Contact Info
        if (!formData.contactInfo.email.trim()) {
          stepErrors.email = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.contactInfo.email)) {
            stepErrors.email = 'Please enter a valid email address';
          }
        }        if (!formData.contactInfo.phone.trim()) {
          stepErrors.phone = 'Phone number is required';
        } else {
          const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
          if (!phoneRegex.test(formData.contactInfo.phone)) {
            stepErrors.phone = 'Please enter a valid phone number';
          }
        }
        break;
        
      case 2: // Preferences
        if (!formData.preferences.interests || formData.preferences.interests.length === 0) {
          stepErrors.interests = 'Please select at least one interest';
        }
        if (!formData.preferences.communication || formData.preferences.communication.length === 0) {
          stepErrors.communication = 'Please select at least one communication method';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  const goToStep = (stepIndex) => {
    // Only allow going to completed steps or the next step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const onEdit = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Form submitted successfully!');
      console.log('Form Data:', formData);
      
      // Reset form or redirect
      // setCurrentStep(0);
      // setFormData({...initialFormData});
      
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepCompleted = (stepIndex) => {
    return stepIndex < currentStep;
  };

  const isStepActive = (stepIndex) => {
    return stepIndex === currentStep;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Form</h1>
          <p className="text-gray-600">Complete the form to create your account</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1">
              <div className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep + 1}
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                    transition-all duration-200 ease-in-out
                    ${isStepCompleted(index)
                      ? 'bg-green-500 border-green-500 text-white'
                      : isStepActive(index)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : index <= currentStep + 1
                      ? 'border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {isStepCompleted(index) ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2
                    ${isStepCompleted(index) ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`
                  text-xs font-medium
                  ${isStepActive(index) ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.title}
                </div>
              </div>
            </div>
          ))}
        </div>        {/* Form Card */}
        <div className="glass-card p-6 md:p-8">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>          {/* Step Content */}
          <div className="mb-8">
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onEdit={currentStep === steps.length - 1 ? onEdit : undefined}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'glass-button'
                }
              `}
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  flex items-center px-8 py-3 rounded-lg font-medium text-white transition-all duration-200
                  ${isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'glass-button'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <CheckIcon className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="glass-button flex items-center px-6 py-3 text-white rounded-lg font-medium transition-all duration-200"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Your information is secure and will never be shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
