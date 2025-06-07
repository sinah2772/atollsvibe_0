import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

const PreferencesStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('preferences', { ...formData.preferences, [field]: value });
  };

  const handleInterestChange = (interest, checked) => {
    const currentInterests = formData.preferences?.interests || [];
    const updatedInterests = checked
      ? [...currentInterests, interest]
      : currentInterests.filter(item => item !== interest);
    
    updateFormData('preferences', { 
      ...formData.preferences, 
      interests: updatedInterests 
    });
  };

  const interests = [
    'Technology',
    'Travel',
    'Food & Cooking',
    'Sports',
    'Music',
    'Art & Design',
    'Health & Fitness',
    'Books & Literature',
    'Movies & TV',
    'Gaming'
  ];

  const communicationMethods = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS/Text' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'push', label: 'Push Notifications' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tell us about your preferences
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Help us personalize your experience by sharing your interests and communication preferences.
        </p>
      </div>

      {/* Interests Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What are you interested in? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => {
            const isSelected = formData.preferences?.interests?.includes(interest) || false;
            return (              <label
                key={interest}
                className={`glass-card relative flex items-center p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'text-indigo-700'
                    : 'hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={(e) => handleInterestChange(interest, e.target.checked)}
                />
                <div className={`flex-shrink-0 w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                  isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{interest}</span>
              </label>
            );
          })}
        </div>
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
        )}
      </div>

      {/* Communication Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you like us to communicate with you?
        </label>
        <div className="space-y-2">
          {communicationMethods.map((method) => {
            const isSelected = formData.preferences?.communication?.includes(method.value) || false;
            return (              <label
                key={method.value}
                className="glass-card flex items-center p-3 cursor-pointer hover:border-gray-400 transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={isSelected}
                  onChange={(e) => {
                    const currentComm = formData.preferences?.communication || [];
                    const updatedComm = e.target.checked
                      ? [...currentComm, method.value]
                      : currentComm.filter(item => item !== method.value);
                    
                    updateFormData('preferences', {
                      ...formData.preferences,
                      communication: updatedComm
                    });
                  }}
                />
                <span className="ml-3 text-sm text-gray-700">{method.label}</span>
              </label>
            );
          })}
        </div>
        {errors.communication && (
          <p className="mt-1 text-sm text-red-600">{errors.communication}</p>
        )}
      </div>

      {/* Newsletter Subscription */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Newsletter & Updates
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.preferences?.newsletter || false}
              onChange={(e) => handleChange('newsletter', e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700">
              Subscribe to our newsletter for updates and special offers
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.preferences?.marketing || false}
              onChange={(e) => handleChange('marketing', e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700">
              Receive promotional emails and marketing materials
            </span>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Privacy Settings
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.preferences?.profilePublic || false}
              onChange={(e) => handleChange('profilePublic', e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700">
              Make my profile visible to other users
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.preferences?.dataSharing || false}
              onChange={(e) => handleChange('dataSharing', e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700">
              Allow anonymous data sharing for service improvements
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
