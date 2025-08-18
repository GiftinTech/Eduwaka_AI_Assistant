/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/button';
import { EditIcon } from 'lucide-react';

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string; // Assuming Django's date_joined field
  last_login?: string; // Assuming Django's last_login field
  // Add other fields from your Django UserProfile model as needed
}

const UserProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>(user?.email || ''); // Initialize with current user email
  const [newFirstName, setNewFirstName] = useState<string>(
    user?.first_name || '',
  );
  const [newLastName, setNewLastName] = useState<string>(user?.last_name || '');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        setStatusMessage('User not authenticated. Please log in.');
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoading(false);
        setStatusMessage('Authentication token missing. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`${DJANGO_API_BASE_URL}profile/me`, {
          // Endpoint for current user's profile
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch user profile.');
        }

        const data = await response.json();
        console.log(data.results[0]);
        setProfile(data.results[0]);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        setStatusMessage(error.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, DJANGO_API_BASE_URL]);

  const handleUpdateProfile = async () => {
    if (!user) {
      setStatusMessage('User not authenticated.');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setStatusMessage('Authentication token missing. Please log in again.');
      return;
    }

    setStatusMessage('');
    try {
      const response = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: newEmail,
          first_name: newFirstName,
          last_name: newLastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.email?.[0] ||
            errorData.detail ||
            errorData.message ||
            'Failed to update profile.',
        );
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setStatusMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setStatusMessage('Failed to update profile: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-700">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h2>
      <p className="mb-4 text-gray-700">
        Manage your personal information and saved data.
      </p>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        {statusMessage && (
          <div
            className={`mb-4 rounded-lg p-3 ${statusMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {statusMessage}
          </div>
        )}

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="profileEmail"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="profileEmail"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                value={newEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewEmail(e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="profileFirstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="profileFirstName"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                value={newFirstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewFirstName(e.target.value)
                }
              />
            </div>
            <div>
              <label
                htmlFor="profileLastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="profileLastName"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                value={newLastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewLastName(e.target.value)
                }
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateProfile}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="-mb-4 flex justify-between">
              <p className="text-gray-700">
                <span className="font-medium">Username:</span>{' '}
                {profile?.username || 'N/A'}
              </p>
              <div
                className="group relative inline-block"
                onClick={() => setEditMode(true)}
              >
                <Button variant="ghost" className="cursor-pointer">
                  <EditIcon size={20} />
                </Button>
                <div className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 scale-0 transform rounded bg-gray-800 px-2 py-1 text-sm text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                  Edit Profile
                </div>
              </div>
            </div>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span>{' '}
              {profile?.email || 'N/A'}
            </p>
            {profile?.first_name && (
              <p className="text-gray-700">
                <span className="font-medium">First Name:</span>{' '}
                {profile.first_name}
              </p>
            )}
            {profile?.last_name && (
              <p className="text-gray-700">
                <span className="font-medium">Last Name:</span>{' '}
                {profile.last_name}
              </p>
            )}
            {profile?.date_joined && (
              <p className="text-gray-700">
                <span className="font-medium">Joined:</span>{' '}
                {new Date(profile.date_joined).toLocaleDateString()}
              </p>
            )}
            {profile?.last_login && (
              <p className="text-gray-700">
                <span className="font-medium">Last Login:</span>{' '}
                {new Date(profile.last_login).toLocaleString()}
              </p>
            )}
            <p className="text-gray-700">
              <span className="font-medium">Your User ID:</span>{' '}
              <span className="break-all font-mono text-sm">
                {profile?.id || 'N/A'}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">Saved Data</h3>
        <p className="text-gray-700">
          This section will display your saved institutions, courses, and other
          personalized data.
        </p>
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="italic text-gray-600">
            No saved items yet. Start exploring to save your preferences!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
