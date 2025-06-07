// ClassificationStep.js
import React from 'react';

const ClassificationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData('classification', { [field]: value });
  };

  const handleMultiSelect = (field, value, isChecked) => {
    const currentValues = formData.classification?.[field] || [];
    let newValues;
    
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }
    
    handleChange(field, newValues);
  };

  // Mock data - in a real application these would come from an API
  const categories = [
    'News', 'Politics', 'Sports', 'Business', 'Technology', 
    'Entertainment', 'Health', 'Science', 'Education'
  ];
  
  const subcategories = {
    'News': ['Local', 'International', 'Breaking'],
    'Politics': ['Government', 'Elections', 'Policy'],
    'Sports': ['Football', 'Cricket', 'Water Sports', 'Athletics'],
    'Business': ['Economy', 'Finance', 'Trade', 'Tourism'],
    'Technology': ['Internet', 'Mobile', 'Software', 'Hardware'],
    'Entertainment': ['Movies', 'Music', 'Celebrity', 'Arts'],
    'Health': ['Medicine', 'Wellness', 'Nutrition'],
    'Science': ['Research', 'Environment', 'Space'],
    'Education': ['Schools', 'University', 'Training']
  };

  const atolls = [
    'Haa Alifu', 'Haa Dhaalu', 'Shaviyani', 'Noonu', 'Raa',
    'Baa', 'Lhaviyani', 'Kaafu', 'Alifu Alifu', 'Alifu Dhaalu',
    'Vaavu', 'Meemu', 'Faafu', 'Dhaalu', 'Thaa', 'Laamu',
    'Gaafu Alifu', 'Gaafu Dhaalu', 'Gnaviyani', 'Seenu', 'Malé City'
  ];

  const ministries = [
    'Ministry of Foreign Affairs',
    'Ministry of Defense',
    'Ministry of Home Affairs',
    'Ministry of Finance',
    'Ministry of Education',
    'Ministry of Health',
    'Ministry of Transport and Civil Aviation',
    'Ministry of Tourism',
    'Ministry of Fisheries and Agriculture',
    'Ministry of Environment',
    'Ministry of Islamic Affairs',
    'Ministry of Arts, Culture and Heritage',
    'Ministry of Youth, Sports and Community Empowerment',
    'Ministry of National Planning, Housing and Infrastructure',
    'Ministry of Higher Education',
    'Ministry of Economic Development'
  ];

  // Get available subcategories based on selected categories
  const availableSubcategories = Array.from(new Set(
    (formData.classification?.categories || []).flatMap(cat => subcategories[cat] || [])
  ));
  return (
    <div className="space-y-6">
      <div className="glass-card p-4">
        <label className="form-label">
          Categories (Multi-select) *
        </label>
        <div className={`glass-card p-4 ${errors.categories ? 'error-border' : ''}`}>
          {categories.map((category) => (
            <div key={category} className="checkbox-item">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={formData.classification?.categories?.includes(category) || false}
                onChange={(e) => handleMultiSelect('categories', category, e.target.checked)}
              />
              <label htmlFor={`category-${category}`}>
                {category}
              </label>
            </div>
          ))}
        </div>
        {errors.categories && (
          <p className="error-message">{errors.categories}</p>
        )}
      </div>

      {formData.classification?.categories?.length > 0 && (
        <div className="glass-card p-4">
          <label className="form-label">
            Subcategories
          </label>
          <div className="glass-card p-4">
            {availableSubcategories.map((subcategory) => (
              <div key={subcategory} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`subcategory-${subcategory}`}
                  checked={formData.classification?.subcategories?.includes(subcategory) || false}
                  onChange={(e) => handleMultiSelect('subcategories', subcategory, e.target.checked)}
                />
                <label htmlFor={`subcategory-${subcategory}`}>
                  {subcategory}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-4">
        <label className="form-label">
          Atolls
        </label>
        <select
          className="glass-input"
          value={formData.classification?.atoll || ''}
          onChange={(e) => handleChange('atoll', e.target.value)}
        >
          <option value="">Select an atoll</option>
          {atolls.map((atoll) => (
            <option key={atoll} value={atoll}>
              {atoll}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-card p-4">
        <label className="form-label">
          Government Ministries
        </label>
        <select
          className="glass-input"
          value={formData.classification?.ministry || ''}
          onChange={(e) => handleChange('ministry', e.target.value)}
        >
          <option value="">Select a ministry</option>
          {ministries.map((ministry) => (
            <option key={ministry} value={ministry}>
              {ministry}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClassificationStep;
