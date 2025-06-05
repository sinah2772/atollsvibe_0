import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ReviewStep = ({ formData, errors, onEdit }) => {
  const formatArrayData = (data) => {
    if (Array.isArray(data)) {
      return data.length > 0 ? data.join(', ') : 'None selected';
    }
    return data || 'Not specified';
  };

  const formatBooleanData = (data) => {
    return data ? 'Yes' : 'No';
  };

  const sections = [
    {
      title: 'Personal Information',
      step: 0,
      data: [
        { label: 'First Name', value: formData.personalInfo?.firstName },
        { label: 'Last Name', value: formData.personalInfo?.lastName },
        { label: 'Date of Birth', value: formData.personalInfo?.dateOfBirth },
        { label: 'Gender', value: formData.personalInfo?.gender },
        { label: 'Country', value: formData.personalInfo?.country }
      ]
    },
    {
      title: 'Contact Information',
      step: 1,
      data: [
        { label: 'Email', value: formData.contactInfo?.email },
        { label: 'Phone', value: formData.contactInfo?.phone },
        { label: 'Address', value: formData.contactInfo?.address },
        { label: 'City', value: formData.contactInfo?.city },
        { label: 'Postal Code', value: formData.contactInfo?.postalCode }
      ]
    },
    {
      title: 'Preferences',
      step: 2,
      data: [
        { 
          label: 'Interests', 
          value: formatArrayData(formData.preferences?.interests) 
        },
        { 
          label: 'Communication Methods', 
          value: formatArrayData(formData.preferences?.communication) 
        },
        { 
          label: 'Newsletter Subscription', 
          value: formatBooleanData(formData.preferences?.newsletter) 
        },
        { 
          label: 'Marketing Emails', 
          value: formatBooleanData(formData.preferences?.marketing) 
        },
        { 
          label: 'Public Profile', 
          value: formatBooleanData(formData.preferences?.profilePublic) 
        },
        { 
          label: 'Data Sharing', 
          value: formatBooleanData(formData.preferences?.dataSharing) 
        }
      ]
    }
  ];

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Review Your Information
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Please review all the information you've provided. You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              {section.title}
            </h4>
            <button
              type="button"
              onClick={() => onEdit(section.step)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.data.map((item) => (
              <div key={item.label} className="space-y-1">
                <dt className="text-sm font-medium text-gray-500">
                  {item.label}
                </dt>
                <dd className="text-sm text-gray-900">
                  {item.value || 'Not provided'}
                </dd>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Terms and Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Terms and Conditions
        </h4>
        <div className="space-y-3">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
              required
            />            <span className="ml-3 text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-800 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-800 underline">
                Privacy Policy
              </a>
            </span>
          </label>
          
          <label className="flex items-start">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
            />
            <span className="ml-3 text-sm text-gray-700">
              I would like to receive important updates about my account and services
            </span>
          </label>
        </div>
      </div>

      {/* Submission Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              Ready to submit?
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              Once you submit this form, you'll receive a confirmation email with your account details.
              You can always update your preferences later in your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
