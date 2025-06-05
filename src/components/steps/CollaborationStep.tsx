import React from 'react';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, Clock, UserPlus, Trash2, Plus, Workflow, Bell } from 'lucide-react';
import { StepProps } from '../MultiStepForm';

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

  const handleFieldChange = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const addCollaborator = () => {
    const currentCollaborators = formData.collaborators || [];
    handleFieldChange('collaborators', [
      ...currentCollaborators,
      { email: '', role: 'contributor', permissions: [] }
    ]);
  };

  const updateCollaborator = (index: number, field: string, value: any) => {
    const currentCollaborators = formData.collaborators || [];
    const updatedCollaborators = currentCollaborators.map((collaborator, i) => 
      i === index ? { ...collaborator, [field]: value } : collaborator
    );
    handleFieldChange('collaborators', updatedCollaborators);
  };

  const removeCollaborator = (index: number) => {
    const currentCollaborators = formData.collaborators || [];
    const updatedCollaborators = currentCollaborators.filter((_, i) => i !== index);
    handleFieldChange('collaborators', updatedCollaborators);
  };

  const addComment = () => {
    const currentComments = formData.internalComments || [];
    const newComment = {
      id: Date.now().toString(),
      author: 'Current User', // This should come from user context
      text: '',
      timestamp: new Date().toISOString(),
      isEditing: true
    };
    handleFieldChange('internalComments', [...currentComments, newComment]);
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

      {/* Collaborators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            {text.collaborators}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {text.collaboratorsDesc}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.collaborators || []).map((collaborator, index) => (
            <div key={index} className="flex gap-3 items-end p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor={`collaborator-email-${index}`}>{text.collaboratorEmail}</Label>
                <Input
                  id={`collaborator-email-${index}`}
                  type="email"
                  placeholder="user@example.com"
                  value={collaborator.email}
                  onChange={(e) => updateCollaborator(index, 'email', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`collaborator-role-${index}`}>{text.collaboratorRole}</Label>
                <Select
                  value={collaborator.role}
                  onValueChange={(value) => updateCollaborator(index, 'role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">{text.roles.editor}</SelectItem>
                    <SelectItem value="reviewer">{text.roles.reviewer}</SelectItem>
                    <SelectItem value="contributor">{text.roles.contributor}</SelectItem>
                    <SelectItem value="viewer">{text.roles.viewer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeCollaborator(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addCollaborator}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {text.addCollaborator}
          </Button>
        </CardContent>
      </Card>

      {/* Workflow Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Workflow className="h-5 w-5" />
            {text.workflow}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workflowStatus">{text.workflowStatus}</Label>
              <Select
                value={formData.workflowStatus || 'draft'}
                onValueChange={(value) => handleFieldChange('workflowStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{text.statuses.draft}</SelectItem>
                  <SelectItem value="in_review">{text.statuses.in_review}</SelectItem>
                  <SelectItem value="needs_revision">{text.statuses.needs_revision}</SelectItem>
                  <SelectItem value="approved">{text.statuses.approved}</SelectItem>
                  <SelectItem value="scheduled">{text.statuses.scheduled}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">{text.priority}</Label>
              <Select
                value={formData.priority || 'medium'}
                onValueChange={(value) => handleFieldChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{text.priorities.low}</SelectItem>
                  <SelectItem value="medium">{text.priorities.medium}</SelectItem>
                  <SelectItem value="high">{text.priorities.high}</SelectItem>
                  <SelectItem value="urgent">{text.priorities.urgent}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignedTo">{text.assignedTo}</Label>
              <Input
                id="assignedTo"
                placeholder="user@example.com"
                value={formData.assignedTo || ''}
                onChange={(e) => handleFieldChange('assignedTo', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">{text.dueDate}</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate || ''}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            {text.scheduling}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="publishNow"
                checked={formData.publishSchedule === 'now'}
                onCheckedChange={(checked) => 
                  handleFieldChange('publishSchedule', checked ? 'now' : 'scheduled')
                }
              />
              <Label htmlFor="publishNow">{text.publishNow}</Label>
            </div>

            {formData.publishSchedule === 'scheduled' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                <div>
                  <Label htmlFor="scheduledDate">{text.scheduledDate}</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => handleFieldChange('scheduledDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledTime">{text.scheduledTime}</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime || ''}
                    onChange={(e) => handleFieldChange('scheduledTime', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">{text.timezone}</Label>
                  <Select
                    value={formData.timezone || 'Asia/Maldives'}
                    onValueChange={(value) => handleFieldChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Maldives">Maldives Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Dubai">Dubai Time</SelectItem>
                      <SelectItem value="Asia/Kolkata">India Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{text.reviewSettings}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="requireReview"
              checked={formData.requireReview || false}
              onCheckedChange={(checked) => handleFieldChange('requireReview', checked)}
            />
            <Label htmlFor="requireReview">{text.requireReview}</Label>
          </div>

          {formData.requireReview && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <Label htmlFor="reviewers">{text.reviewers}</Label>
                <Input
                  id="reviewers"
                  placeholder="reviewer1@example.com, reviewer2@example.com"
                  value={formData.reviewers || ''}
                  onChange={(e) => handleFieldChange('reviewers', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="approvalLevel">{text.approvalLevel}</Label>
                <Select
                  value={formData.approvalLevel || 'one'}
                  onValueChange={(value) => handleFieldChange('approvalLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one">{text.approvalLevels.one}</SelectItem>
                    <SelectItem value="two">{text.approvalLevels.two}</SelectItem>
                    <SelectItem value="all">{text.approvalLevels.all}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            {text.notifications}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="notifyOnComment"
                checked={formData.notifyOnComment || false}
                onCheckedChange={(checked) => handleFieldChange('notifyOnComment', checked)}
              />
              <Label htmlFor="notifyOnComment">{text.notifyOnComment}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notifyOnStatusChange"
                checked={formData.notifyOnStatusChange || false}
                onCheckedChange={(checked) => handleFieldChange('notifyOnStatusChange', checked)}
              />
              <Label htmlFor="notifyOnStatusChange">{text.notifyOnStatusChange}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notifyOnPublish"
                checked={formData.notifyOnPublish || false}
                onCheckedChange={(checked) => handleFieldChange('notifyOnPublish', checked)}
              />
              <Label htmlFor="notifyOnPublish">{text.notifyOnPublish}</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Validation function for this step
export const validateCollaboration = (formData: any): string[] => {
  const errors: string[] = [];

  // Validate collaborators
  if (formData.collaborators && formData.collaborators.length > 0) {
    formData.collaborators.forEach((collaborator: any, index: number) => {
      if (!collaborator.email) {
        errors.push(`Collaborator ${index + 1}: Email is required`);
      } else if (!isValidEmail(collaborator.email)) {
        errors.push(`Collaborator ${index + 1}: Invalid email format`);
      }
    });
  }

  // Validate scheduled publishing
  if (formData.publishSchedule === 'scheduled') {
    if (!formData.scheduledDate) {
      errors.push('Scheduled date is required when scheduling publication');
    }
    if (!formData.scheduledTime) {
      errors.push('Scheduled time is required when scheduling publication');
    }
  }

  // Validate review settings
  if (formData.requireReview) {
    if (!formData.reviewers) {
      errors.push('Reviewers are required when review is enabled');
    }
  }

  // Validate assigned user
  if (formData.assignedTo && !isValidEmail(formData.assignedTo)) {
    errors.push('Invalid email format for assigned user');
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
