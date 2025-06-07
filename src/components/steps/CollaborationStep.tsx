import React from 'react';
import { Users, UserPlus, Workflow, Bell, Calendar } from 'lucide-react';
import { StepProps } from '../../types/editor';
import Button from '../ui/Button';

// Define types for form data
interface Collaborator {
  email: string;
  role: 'editor' | 'reviewer' | 'contributor' | 'viewer';
  permissions: string[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isEditing?: boolean;
}

// Define proper type for field values
type FieldValue = string | boolean | Collaborator[] | Comment[] | Date;

export const CollaborationStep: React.FC<StepProps> = ({ 
  formData, 
  onFormDataChange,
  language = 'en'
}) => {
  const t = {
    en: {
      title: 'Collaboration & Workflow',
      description: 'Manage collaborators, workflow, and scheduling',
      collaborators: 'Collaborators',
      collaboratorsDesc: 'Add team members to collaborate on this article',
      addCollaborator: 'Add Collaborator',
      collaboratorEmail: 'Email',
      collaboratorRole: 'Role',
      permissions: 'Permissions',
      workflow: 'Workflow Settings',
      workflowStatus: 'Current Status',
      assignedTo: 'Assigned To',
      dueDate: 'Due Date',
      priority: 'Priority',
      scheduling: 'Scheduling',
      publishSchedule: 'Publish Schedule',
      publishNow: 'Publish Now',
      scheduleFor: 'Schedule for Later',
      scheduledDate: 'Scheduled Date',
      scheduledTime: 'Scheduled Time',
      timezone: 'Timezone',
      notifications: 'Notifications',
      emailNotifications: 'Email Notifications',
      notifyOnComment: 'Notify on Comments',
      notifyOnStatusChange: 'Notify on Status Changes',
      notifyOnPublish: 'Notify when Published',
      reviewSettings: 'Review Settings',
      requireReview: 'Require Review',
      reviewers: 'Reviewers',
      approvalLevel: 'Approval Level',
      comments: 'Comments & Notes',
      internalComments: 'Internal Comments',
      addComment: 'Add Comment',
      roles: {
        editor: 'Editor',
        reviewer: 'Reviewer',
        contributor: 'Contributor',
        viewer: 'Viewer'
      },
      statuses: {
        draft: 'Draft',
        in_review: 'In Review',
        needs_revision: 'Needs Revision',
        approved: 'Approved',
        scheduled: 'Scheduled',
        published: 'Published'
      },
      priorities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent'
      },
      approvalLevels: {
        one: 'One Reviewer',
        two: 'Two Reviewers',
        all: 'All Reviewers'
      },
      remove: 'Remove',
      required: 'Required'
    },
    dv: {
      title: 'ކޮލަބޮރޭޝަން އަދި ވޯކްފްލޯ',
      description: 'ޓީމް މެމްބަރުން، ވޯކްފްލޯ، އަދި ޝެޑިއުލިން ބެލެހެއްޓުން',
      collaborators: 'ފަރީޤްގެ މެމްބަރުން',
      collaboratorsDesc: 'މި ލިޔުމަށް ކޮލަބޮރޭޓް ކުރާ ޓީމް މެމްބަރުން އިތުރުކުރުން',
      addCollaborator: 'ކޮލަބޮރޭޓަރ އިތުރުކުރުން',
      collaboratorEmail: 'އީމެއިލް',
      collaboratorRole: 'ޒިންމާ',
      permissions: 'ހުއްދަތައް',
      workflow: 'ވޯކްފްލޯ ސެޓިންގްސް',
      workflowStatus: 'މިހާރުގެ ހާލަތު',
      assignedTo: 'ހަވާލުކުރެވުނު ފަރާތް',
      dueDate: 'ނިމޭ ތާރީޚު',
      priority: 'އިސްކަން',
      scheduling: 'ޝެޑިއުލިން',
      publishSchedule: 'ޕަބްލިޝް ކުރުމުގެ ޝެޑިއުލް',
      publishNow: 'މިހާރު ޕަބްލިޝް ކުރުން',
      scheduleFor: 'ފަހުން ޝެޑިއުލް ކުރުން',
      scheduledDate: 'ޝެޑިއުލް ކުރެވުނު ތާރީޚު',
      scheduledTime: 'ޝެޑިއުލް ކުރެވުނު ވަގުތު',
      timezone: 'ޓައިމްޒޯން',
      notifications: 'ނޯޓިފިކޭޝަންތައް',
      emailNotifications: 'އީމެއިލް ނޯޓިފިކޭޝަންތައް',
      notifyOnComment: 'ކޮމެންޓް ލިބުނު ވަގުތު ނޯޓިފައި ކުރުން',
      notifyOnStatusChange: 'ހާލަތު ބަދަލުވުމުން ނޯޓިފައި ކުރުން',
      notifyOnPublish: 'ޕަބްލިޝް ވުމުން ނޯޓިފައި ކުރުން',
      reviewSettings: 'ރިވިއު ސެޓިންގްސް',
      requireReview: 'ރިވިއު ބޭނުންވާ',
      reviewers: 'ރިވިއުވަރުން',
      approvalLevel: 'އެޕްރޫވަލް ލެވެލް',
      comments: 'ކޮމެންޓްތަކާއި ނޯޓްސް',
      internalComments: 'އިންޓަރނަލް ކޮމެންޓްތައް',
      addComment: 'ކޮމެންޓް އިތުރުކުރުން',
      roles: {
        editor: 'އެޑިޓަރ',
        reviewer: 'ރިވިއުވަރ',
        contributor: 'ކޮންޓްރިބިއުޓަރ',
        viewer: 'ބަލާ ފަރާތް'
      },
      statuses: {
        draft: 'ޑްރާފްޓް',
        in_review: 'ރިވިއުގައި',
        needs_revision: 'ރިވިޒަން ބޭނުން',
        approved: 'އެޕްރޫވް',
        scheduled: 'ޝެޑިއުލް',
        published: 'ޕަބްލިޝް'
      },
      priorities: {
        low: 'ދަށް',
        medium: 'މެދު',
        high: 'މަތި',
        urgent: 'އަވަސް'
      },
      approvalLevels: {
        one: 'އެކެއް ރިވިއުވަރ',
        two: 'ދެ ރިވިއުވަރ',
        all: 'ހުރިހާ ރިވިއުވަރުން'
      },
      remove: 'ނައްކާ',
      required: 'ބޭނުންވާ'
    }
  };
  const text = t[language];

  const handleFieldChange = (field: string, value: FieldValue) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const addCollaborator = () => {
    const currentCollaborators = (formData.collaborators as Collaborator[]) || [];
    handleFieldChange('collaborators', [
      ...currentCollaborators,
      { email: '', role: 'contributor' as const, permissions: [] }
    ]);
  };

  const updateCollaborator = (index: number, field: string, value: string) => {
    const currentCollaborators = (formData.collaborators as Collaborator[]) || [];
    const updatedCollaborators = currentCollaborators.map((collaborator, i) => 
      i === index ? { ...collaborator, [field]: value } : collaborator
    );
    handleFieldChange('collaborators', updatedCollaborators);
  };

  const removeCollaborator = (index: number) => {
    const currentCollaborators = (formData.collaborators as Collaborator[]) || [];
    const updatedCollaborators = currentCollaborators.filter((_, i) => i !== index);
    handleFieldChange('collaborators', updatedCollaborators);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {text.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {text.description}
        </p>
      </div>

      {/* Collaborators Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Users className="h-5 w-5" />
            {text.collaborators}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {text.collaboratorsDesc}
          </p>
        </div>
        
        <div className="space-y-4">
          {((formData.collaborators as Collaborator[]) || []).map((collaborator: Collaborator, index: number) => (
            <div key={index} className="flex gap-3 items-end p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex-1">
                <label htmlFor={`collaborator-email-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.collaboratorEmail}
                </label>
                <input
                  type="email"
                  id={`collaborator-email-${index}`}
                  value={collaborator.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCollaborator(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="collaborator@example.com"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`collaborator-role-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.collaboratorRole}
                </label>
                <select
                  id={`collaborator-role-${index}`}
                  value={collaborator.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateCollaborator(index, 'role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="editor">{text.roles.editor}</option>
                  <option value="reviewer">{text.roles.reviewer}</option>
                  <option value="contributor">{text.roles.contributor}</option>
                  <option value="viewer">{text.roles.viewer}</option>
                </select>
              </div>
              <Button
                onClick={() => removeCollaborator(index)}
                variant="delete"
                className="flex items-center gap-1"
              >
                {text.remove}
              </Button>
            </div>
          ))}
          <Button
            onClick={addCollaborator}
            variant="add"
            className="flex items-center gap-2 w-full"
          >
            <UserPlus className="h-4 w-4" />
            {text.addCollaborator}
          </Button>
        </div>
      </div>

      {/* Workflow Settings Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Workflow className="h-5 w-5" />
            {text.workflow}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="workflowStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {text.workflowStatus}
            </label>
            <select
              id="workflowStatus"
              value={(formData.workflowStatus as string) || 'draft'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('workflowStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">{text.statuses.draft}</option>
              <option value="in_review">{text.statuses.in_review}</option>
              <option value="needs_revision">{text.statuses.needs_revision}</option>
              <option value="approved">{text.statuses.approved}</option>
              <option value="scheduled">{text.statuses.scheduled}</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {text.priority}
            </label>
            <select
              id="priority"
              value={(formData.priority as string) || 'medium'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="low">{text.priorities.low}</option>
              <option value="medium">{text.priorities.medium}</option>
              <option value="high">{text.priorities.high}</option>
              <option value="urgent">{text.priorities.urgent}</option>
            </select>
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {text.assignedTo}
            </label>
            <input
              type="email"
              id="assignedTo"
              value={(formData.assignedTo as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="assignee@example.com"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {text.dueDate}
            </label>
            <input
              type="date"
              id="dueDate"
              value={(formData.dueDate as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Scheduling Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Calendar className="h-5 w-5" />
            {text.scheduling}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publishNow"
              checked={(formData.publishSchedule as string) === 'now'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFieldChange('publishSchedule', e.target.checked ? 'now' : 'scheduled')
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="publishNow" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {text.publishNow}
            </label>
          </div>

          {(formData.publishSchedule as string) !== 'now' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.scheduledDate}
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  value={(formData.scheduledDate as string) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('scheduledDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.scheduledTime}
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  value={(formData.scheduledTime as string) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('scheduledTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.timezone}
                </label>
                <select
                  id="timezone"
                  value={(formData.timezone as string) || 'Asia/Maldives'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                >
                  <option value="Asia/Maldives">Maldives Time</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Dubai">Dubai Time</option>
                  <option value="Asia/Kolkata">India Time</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Settings Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {text.reviewSettings}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="requireReview"
              checked={(formData.requireReview as boolean) || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('requireReview', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requireReview" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {text.requireReview}
            </label>
          </div>

          {(formData.requireReview as boolean) && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label htmlFor="reviewers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.reviewers}
                </label>
                <input
                  type="text"
                  id="reviewers"
                  value={(formData.reviewers as string) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('reviewers', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="reviewer1@example.com, reviewer2@example.com"
                />
              </div>

              <div>
                <label htmlFor="approvalLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {text.approvalLevel}
                </label>
                <select
                  id="approvalLevel"
                  value={(formData.approvalLevel as string) || 'one'}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('approvalLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                >
                  <option value="one">{text.approvalLevels.one}</option>
                  <option value="two">{text.approvalLevels.two}</option>
                  <option value="all">{text.approvalLevels.all}</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Bell className="h-5 w-5" />
            {text.notifications}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifyOnComment"
              checked={(formData.notifyOnComment as boolean) || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('notifyOnComment', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyOnComment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {text.notifyOnComment}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifyOnStatusChange"
              checked={(formData.notifyOnStatusChange as boolean) || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('notifyOnStatusChange', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyOnStatusChange" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {text.notifyOnStatusChange}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifyOnPublish"
              checked={(formData.notifyOnPublish as boolean) || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('notifyOnPublish', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifyOnPublish" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {text.notifyOnPublish}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
