import React from 'react';

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
    'Technology', 'Travel', 'Food & Cooking', 'Sports',
    'Music', 'Art & Design', 'Health & Fitness', 'Books & Literature'
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
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937', marginBottom: '1rem' }}>
          Tell us about your preferences
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Help us personalize your experience by sharing your interests and communication preferences.
        </p>
      </div>

      {/* Interests Selection */}
      <div className="form-group">
        <label className="form-label">
          What are you interested in? (Select all that apply) *
        </label>
        <div className="grid-2">
          {interests.map((interest) => {
            const isSelected = formData.preferences?.interests?.includes(interest) || false;
            return (              <label
                key={interest}
                className={`glass-card ${isSelected ? 'glass-selected' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  color: isSelected ? '#1d4ed8' : '#374151',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <input
                  type="checkbox"
                  style={{ marginRight: '0.75rem' }}
                  checked={isSelected}
                  onChange={(e) => handleInterestChange(interest, e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{interest}</span>
              </label>
            );
          })}
        </div>
        {errors.interests && (
          <p className="error-message">{errors.interests}</p>
        )}
      </div>

      {/* Communication Preferences */}
      <div className="form-group">
        <label className="form-label">
          How would you like us to communicate with you? *
        </label>
        <div className="space-y-3">
          {communicationMethods.map((method) => {
            const isSelected = formData.preferences?.communication?.includes(method.value) || false;
            return (              <label
                key={method.value}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  style={{ marginRight: '0.75rem' }}
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
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{method.label}</span>
              </label>
            );
          })}
        </div>
        {errors.communication && (
          <p className="error-message">{errors.communication}</p>
        )}
      </div>

      {/* Newsletter Subscription */}
      <div className="form-group">
        <label className="form-label">
          Newsletter & Updates
        </label>
        <div className="space-y-3">
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              style={{ marginRight: '0.75rem' }}
              checked={formData.preferences?.newsletter || false}
              onChange={(e) => handleChange('newsletter', e.target.checked)}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Subscribe to our newsletter for updates and special offers
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              style={{ marginRight: '0.75rem' }}
              checked={formData.preferences?.marketing || false}
              onChange={(e) => handleChange('marketing', e.target.checked)}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Receive promotional emails and marketing materials
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
