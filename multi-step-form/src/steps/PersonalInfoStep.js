import React from 'react';

const PersonalInfoStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.firstName 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500'
              }
            `}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.lastName 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500'
              }
            `}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.dateOfBirth 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500'
              }
            `}
          />
          {errors.dateOfBirth && (
            <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => updateFormData('gender', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
              ${errors.gender 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500'
              }
            `}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Why do we need this information?</h3>
        <p className="text-sm text-blue-700">
          This information helps us personalize your experience and ensure we're providing 
          age-appropriate content and services. All information is kept private and secure.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
