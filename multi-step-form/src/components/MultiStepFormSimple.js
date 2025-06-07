import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from './Icons';

// Step Components
import PersonalInfoStep from '../steps/PersonalInfoStepSimple';
import ContactInfoStep from '../steps/ContactInfoStepSimple';
import PreferencesStep from '../steps/PreferencesStepSimple';
import ReviewStep from '../steps/ReviewStepSimple';

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
        }
        if (!formData.contactInfo.phone.trim()) {
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
    <div className="form-container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <h1 className="form-title">Registration Form</h1>
          <p className="form-subtitle">Complete the form to create your account</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-info">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="step-nav">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className="step-connector">
                <button
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep + 1}
                  className={`step-button ${
                    isStepCompleted(index)
                      ? 'completed'
                      : isStepActive(index)
                      ? 'active'
                      : index <= currentStep + 1
                      ? 'inactive'
                      : 'disabled'
                  }`}
                >
                  {isStepCompleted(index) ? (
                    <CheckIcon className="icon-sm" />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`step-line ${isStepCompleted(index) ? 'completed' : ''}`} />
                )}
              </div>
              <div className={`step-title ${isStepActive(index) ? 'active' : ''}`}>
                {step.title}
              </div>
            </div>
          ))}
        </div>        {/* Form Card */}
        <div className="glass-card">
          {/* Step Header */}
          <div className="step-header">
            <h2 className="step-title-main">
              {steps[currentStep].title}
            </h2>
            <p className="step-description">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onEdit={currentStep === steps.length - 1 ? onEdit : undefined}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="btn-nav">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`btn ${currentStep === 0 ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
            >
              <ChevronLeftIcon className="icon mr-2" />
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ opacity: isSubmitting ? 0.5 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '0.5rem'
                    }}></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <CheckIcon className="icon ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
                <ChevronRightIcon className="icon ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          <p>Your information is secure and will never be shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
