import { ValidationField } from '../types/editor';

// Validation function for location and flags step
export const validateLocationAndFlags = (data: Record<string, unknown>): ValidationField[] => {
  const validationFields: ValidationField[] = [];

  // If islands are selected, island category should be selected
  if (data.selectedIslands && Array.isArray(data.selectedIslands) && data.selectedIslands.length > 0) {
    validationFields.push({
      field: 'selectedIslandCategory',
      valid: Boolean(data.selectedIslandCategory && Array.isArray(data.selectedIslandCategory) && data.selectedIslandCategory.length > 0),
      message: data.language === 'dv' ? 'ރަށް ހޮއްވާފައި ވާނަމަ ރަށުގެ ބާވަތް ހޮއްވަވާ' : 'Island category is required when islands are selected'
    });
  }

  // If sponsored, sponsor details are required
  if (data.isSponsored) {
    validationFields.push({
      field: 'sponsoredBy',
      valid: Boolean(data.sponsoredBy && typeof data.sponsoredBy === 'string' && data.sponsoredBy.trim() !== ''),
      message: data.language === 'dv' ? 'ސްޕޮންސަރ ކުރި ފަރާތުގެ ނަން ލާޒިމް' : 'Sponsor name is required for sponsored content'
    });
  }

  // If developing, end date should be in the future
  if (data.isDeveloping && data.developingUntil) {
    const developingDate = new Date(data.developingUntil as string);
    const now = new Date();
    validationFields.push({
      field: 'developingUntil',
      valid: developingDate > now,
      message: data.language === 'dv' ? 'ޑިވެލޮޕިން ޚަބަރުގެ މުއްދަތު ކުރިއަށް ވާން ޖެހޭ' : 'Developing story end date must be in the future'
    });
  }

  return validationFields;
};
