import React from 'react';

const PersonalInfoStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('personalInfo', { [field]: value });
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'Japan', 'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            First Name *
          </label>
          <input
            type="text"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            value={formData.personalInfo?.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Last Name *
          </label>
          <input
            type="text"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            value={formData.personalInfo?.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            Date of Birth *
          </label>
          <input
            type="date"
            className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
            value={formData.personalInfo?.dateOfBirth || ''}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
          {errors.dateOfBirth && (
            <p className="error-message">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Gender *
          </label>
          <select
            className={`form-select ${errors.gender ? 'error' : ''}`}
            value={formData.personalInfo?.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="error-message">{errors.gender}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Country
        </label>
        <select
          className="form-select"
          value={formData.personalInfo?.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
        >
          <option value="">Select your country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
