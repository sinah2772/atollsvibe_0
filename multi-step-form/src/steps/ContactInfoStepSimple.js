import React from 'react';

const ContactInfoStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('contactInfo', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            Email Address *
          </label>          <input
            type="email"
            className={`glass-input ${errors.email ? 'error' : ''}`}
            value={formData.contactInfo?.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Phone Number *
          </label>          <input
            type="tel"
            className={`glass-input ${errors.phone ? 'error' : ''}`}
            value={formData.contactInfo?.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="error-message">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Address
        </label>        <input
          type="text"
          className="glass-input"
          value={formData.contactInfo?.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter your street address"
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">
            City
          </label>          <input
            type="text"
            className="glass-input"
            value={formData.contactInfo?.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Postal Code
          </label>          <input
            type="text"
            className="glass-input"
            value={formData.contactInfo?.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
