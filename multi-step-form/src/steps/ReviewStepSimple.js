import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '../components/Icons';

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
        }
      ]
    }
  ];

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1f2937', marginBottom: '1rem' }}>
          Review Your Information
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Please review all the information you've provided. You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      {hasErrors && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <XCircleIcon style={{ width: '1.25rem', height: '1.25rem', color: '#f87171', marginTop: '0.125rem', marginRight: '0.75rem', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#991b1b' }}>
                Please fix the following errors:
              </h4>
              <ul style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#b91c1c', listStyle: 'disc', paddingLeft: '1rem' }}>
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {sections.map((section) => (
        <div key={section.title} style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginRight: '0.5rem' }} />
              {section.title}
            </h4>
            <button
              type="button"
              onClick={() => onEdit(section.step)}
              style={{
                fontSize: '0.875rem',
                color: '#4f46e5',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Edit
            </button>
          </div>
          
          <div className="grid-2">
            {section.data.map((item) => (
              <div key={item.label} className="space-y-1">
                <dt style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                  {item.label}
                </dt>
                <dd style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                  {item.value || 'Not provided'}
                </dd>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Terms and Conditions */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#1f2937', marginBottom: '1rem' }}>
          Terms and Conditions
        </h4>
        <div className="space-y-3">
          <label style={{ display: 'flex', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              style={{ marginTop: '0.125rem', marginRight: '0.75rem' }}
              required
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              I agree to the{' '}
              <a href="/terms" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
                Privacy Policy
              </a>
            </span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              style={{ marginTop: '0.125rem', marginRight: '0.75rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              I would like to receive important updates about my account and services
            </span>
          </label>
        </div>
      </div>

      {/* Submission Note */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #c3ddfd',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <CheckCircleIcon style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6', marginTop: '0.125rem', marginRight: '0.75rem', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>
              Ready to submit?
            </h4>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#1e3a8a' }}>
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
