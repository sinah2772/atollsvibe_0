import React from 'react';

const ContactInfoStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`glass-input ${errors.email ? 'error' : ''}`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`glass-input ${errors.phone ? 'error' : ''}`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          className={`glass-input ${errors.address ? 'error' : ''}`}
          placeholder="123 Main Street, Apt 4B"
        />
        {errors.address && (
          <p className="mt-2 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            className={`glass-input ${errors.city ? 'error' : ''}`}
            placeholder="New York"
          />
          {errors.city && (
            <p className="mt-2 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateFormData('zipCode', e.target.value)}
            className={`glass-input ${errors.zipCode ? 'error' : ''}`}
            placeholder="10001"
          />
          {errors.zipCode && (
            <p className="mt-2 text-sm text-red-600">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Contact Preferences */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Preferences</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowSMS || false}
              onChange={(e) => updateFormData('allowSMS', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Allow SMS notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowCalls || false}
              onChange={(e) => updateFormData('allowCalls', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Allow phone calls</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
