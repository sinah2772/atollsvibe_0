import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import { Save, Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser, error: userError } = useUser();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      // Update auth email if changed
      const newEmail = formData.get('email') as string;
      if (newEmail !== user?.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: newEmail
        });
        if (authError) throw authError;
      }

      // Update user profile
      await updateUser({
        email: newEmail,
        updated_at: new Date().toISOString()
      });

      setFormError(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    // We're collecting the current password in the form but not using it with Supabase
    // as it handles auth token-based password changes
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      setFormError(null);
      form.reset();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (userError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading user data: {userError}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {formError}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                defaultValue={user?.email}
                required
                aria-label="Email Address"
                placeholder="Email Address"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin mr-2" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                id="current-password"
                type="password"
                name="current-password"
                required
                aria-label="Current Password"
                placeholder="Enter your current password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="new-password"
                type="password"
                name="new-password"
                required
                aria-label="New Password"
                placeholder="Enter your new password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                name="confirm-password"
                required
                aria-label="Confirm New Password"
                placeholder="Confirm your new password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin mr-2" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;