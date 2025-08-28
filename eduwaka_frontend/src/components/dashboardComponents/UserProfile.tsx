/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/button';
import { EditIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
}

// Skeleton loader component for a user profile
const ProfileSkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center space-x-4">
      <div className="h-16 w-16 rounded-full bg-gray-300"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/4 rounded bg-gray-300"></div>
        <div className="h-4 w-1/2 rounded bg-gray-300"></div>
      </div>
    </div>
    <div className="h-4 w-3/4 rounded bg-gray-300"></div>
    <div className="h-4 w-1/2 rounded bg-gray-300"></div>
    <div className="h-4 w-2/3 rounded bg-gray-300"></div>
    <div className="h-4 w-1/3 rounded bg-gray-300"></div>
  </div>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>(user?.email || '');
  const [newFirstName, setNewFirstName] = useState<string>(
    user?.first_name || '',
  );
  const [newLastName, setNewLastName] = useState<string>(user?.last_name || '');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingMessage('Loading your profile...');
      if (!user) {
        setLoading(false);
        setStatusMessage('Please login to view or edit your profile details.');
        setLoadingMessage('');
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoading(false);
        setStatusMessage('Authentication token missing. Please log in again.');
        setLoadingMessage('');
        return;
      }

      try {
        const response = await fetch(`${DJANGO_API_BASE_URL}profile/me`, {
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

        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        setStatusMessage(error.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
        setLoadingMessage('');
      }
    };

    fetchUserProfile();
  }, [user, DJANGO_API_BASE_URL]);

  // handle file select
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) {
      setStatusMessage('Please login to view your profile details.');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setStatusMessage('Authentication token missing. Please log in again.');
      return;
    }

    setStatusMessage('');
    setLoadingMessage('Updating profile...');
    try {
      const formData = new FormData();
      formData.append('email', newEmail);
      formData.append('first_name', newFirstName);
      formData.append('last_name', newLastName);
      if (newPhoto) {
        formData.append('photo', newPhoto);
      }

      const response = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
      }

      const updatedData = await response.json();
      setProfile(updatedData);
      setStatusMessage('Profile updated successfully!');
      setEditMode(false);
      setNewPhoto(null);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setStatusMessage('Failed to update profile: ' + error.message);
    } finally {
      setLoadingMessage('');
    }
  };

  // handle photo upload
  const handlePhotoUpload = async (file: File) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setStatusMessage('Authentication token missing. Please log in again.');
      return;
    }

    setLoadingPhoto(true);
    setStatusMessage('Uploading photo...');
    setLoadingMessage('Uploading photo...');
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photo.');
      }

      const updatedData = await response.json();
      console.log(updatedData);
      setProfile(updatedData);
      setStatusMessage('Photo updated successfully!');
      showAlert('success', 'Photo uploaded successfully 🎉');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      setStatusMessage('Failed to upload photo: ' + err.message);
      showAlert('error', 'Failed to upload photo 😟');
    } finally {
      setLoadingPhoto(false);
      setLoadingMessage('');
    }
  };

  if (loading) {
    return (
      <div>
        {loadingMessage && (
          <div className="mb-4 rounded-lg bg-yellow-100 p-3 text-yellow-800">
            {loadingMessage}
          </div>
        )}
        <h2 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <ProfileSkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div>
      {loadingMessage && (
        <div className="mb-4 rounded-lg bg-yellow-100 p-3 text-yellow-800">
          {loadingMessage}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h2>
        {!user && (
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </div>
      <p className="mb-4 text-gray-700">
        Manage your personal information and saved data.
      </p>
      {profile?.photo && (
        <Button
          variant="secondary"
          className="mb-4"
          onClick={() => document.getElementById('photoUpload')?.click()}
          disabled={loadingPhoto}
        >
          {loadingPhoto ? 'Uploading...' : 'Upload New Photo'}
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handlePhotoUpload(file);
              }
            }}
          />
        </Button>
      )}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        {statusMessage && !user && (
          <div
            className={`mb-4 rounded-lg p-3 ${
              statusMessage.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {statusMessage}
          </div>
        )}

        {editMode && user ? (
          <div className="space-y-4">
            {/* Upload photo input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              {profile?.photo && !newPhoto && (
                <img
                  src={profile.photo}
                  alt="Current Profile"
                  className="mb-2 h-16 w-16 rounded-full object-cover"
                />
              )}
              {newPhoto && (
                <p className="mb-2 text-sm text-gray-600">
                  Selected: {newPhoto.name}
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
            </div>

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
                disabled={loading || loadingPhoto}
              >
                {loading || loadingPhoto ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-400"
                disabled={loading || loadingPhoto}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <img
              src={profile?.photo}
              alt={profile?.username}
              className="h-28 w-28 rounded-full"
            />
            <div className="flex justify-between">
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
