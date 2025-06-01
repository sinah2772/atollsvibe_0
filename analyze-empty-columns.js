import fs from 'fs';
import path from 'path';

// Read the CSV file
const csvPath = 'd:\\articles_rows.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');
const dataRow = lines[1].split(',');

console.log('CSV Analysis Report:');
console.log('===================');
console.log(`Total columns: ${headers.length}`);
console.log(`Data row values: ${dataRow.length}`);
console.log('');

// Analyze each column
const emptyColumns = [];
const nonEmptyColumns = [];

headers.forEach((header, index) => {
  const value = dataRow[index] || '';
  const isEmpty = value === '' || value === '[]' || value === '{}' || value === 'false' || value === '0';
  
  if (isEmpty) {
    emptyColumns.push({ header: header.trim(), index, value });
  } else {
    nonEmptyColumns.push({ header: header.trim(), index, value });
  }
});

console.log('EMPTY COLUMNS (candidates for removal):');
console.log('======================================');
emptyColumns.forEach(col => {
  console.log(`${col.index + 1}. ${col.header} = "${col.value}"`);
});

console.log('\nNON-EMPTY COLUMNS (keep these):');
console.log('===============================');
nonEmptyColumns.forEach(col => {
  console.log(`${col.index + 1}. ${col.header} = "${col.value}"`);
});

console.log('\nCOLUMNS TO REMOVE FROM UI:');
console.log('==========================');
const fieldsToRemove = emptyColumns.filter(col => {
  // Keep essential system fields even if empty
  const systemFields = ['id', 'created_at', 'updated_at', 'status', 'publish_date'];
  return !systemFields.includes(col.header);
});

fieldsToRemove.forEach(col => {
  console.log(`- ${col.header}`);
});

// Map to component field names
const fieldMapping = {
  'subcategory_id': 'subcategory',
  'atoll_ids': 'selectedAtolls',
  'island_ids': 'selectedIslands', 
  'island_category': 'islandCategory',
  'government_ids': 'selectedGovernmentIds',
  'cover_image': 'coverImage',
  'image_caption': 'imageCaption',
  'developing_until': 'developingUntil',
  'sponsored_by': 'sponsoredBy',
  'sponsored_image': 'sponsoredImage',
  'editor_notes': 'editorNotes',
  'author_notes': 'authorNotes',
  'fact_checked': 'factChecked',
  'fact_checker_id': 'factCheckerId',
  'fact_checked_at': 'factCheckedAt',
  'revision_history': 'revisionHistory',
  'original_source_url': 'originalSourceUrl',
  'notification_sent': 'notificationSent',
  'notification_sent_at': 'notificationSentAt',
  'related_articles': 'relatedArticles',
  'next_event_date': 'nextEventDate',
  'collaborators': 'collaborators',
  'active_editors': 'activeEditors',
  'collaboration_notes': 'collaborationNotes',
  'edit_lock_status': 'editLockStatus',
  'real_time_session_id': 'realTimeSessionId',
  'approved_by_id': 'approvedById',
  'approved_at': 'approvedAt',
  'published_by_id': 'publishedById',
  'last_updated_by_id': 'lastUpdatedById',
  'scheduled_notifications': 'scheduledNotifications'
};

console.log('\nCOMPONENT FIELDS TO REMOVE:');
console.log('===========================');
fieldsToRemove.forEach(col => {
  const componentField = fieldMapping[col.header] || col.header;
  console.log(`- ${componentField} (from ${col.header})`);
});
