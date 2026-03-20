/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
import { Camera, Edit2, X, Check } from 'lucide-react';
import {
  PageHeader,
  Input,
  PrimaryButton,
  ErrorMessage,
} from './DashboardComponents';

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
  photo_url?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showAlert } = useAlert();
  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile.');
        const data = await res.json();
        setProfile(data);
        setNewEmail(data.email ?? '');
        setNewFirstName(data.first_name ?? '');
        setNewLastName(data.last_name ?? '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, DJANGO_API_BASE_URL]);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('email', newEmail);
      formData.append('first_name', newFirstName);
      formData.append('last_name', newLastName);
      if (newPhoto) formData.append('photo', newPhoto);
      const res = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update profile.');
      const updated = await res.json();
      setProfile(updated);
      // Sync AuthContext so Header/DashboardHeader reflect changes instantly
      updateUser({
        photo_url: updated.photo_url ?? updated.photo,
        first_name: updated.first_name,
        last_name: updated.last_name,
        username: updated.username,
        email: updated.email,
      });
      setEditMode(false);
      setNewPhoto(null);
      showAlert('success', 'Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setPhotoLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch(`${DJANGO_API_BASE_URL}profile/me/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed.');
      const updated = await res.json();
      setProfile(updated);
      // Sync AuthContext so Header/DashboardHeader re-render with the new photo instantly
      updateUser({ photo: updated.photo_url ?? updated.photo });
      showAlert('success', 'Photo updated successfully 🎉');
    } catch {
      showAlert('error', 'Failed to upload photo 😟');
    } finally {
      setPhotoLoading(false);
    }
  };

  const initials = profile?.first_name
    ? `${profile.first_name[0]}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : (profile?.username?.[0] ?? profile?.email?.[0] ?? 'U').toUpperCase();

  // Loading skeleton
  if (loading) {
    return (
      <div>
        <PageHeader
          title="My Profile"
          subtitle="Manage your personal information."
        />
        <div className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 animate-pulse rounded-full bg-[#f3f4f6]" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-lg bg-[#f3f4f6]" />
              <div className="h-3 w-48 animate-pulse rounded-lg bg-[#f3f4f6]" />
            </div>
          </div>
          <div className="h-3 w-3/4 animate-pulse rounded-lg bg-[#f3f4f6]" />
          <div className="h-3 w-1/2 animate-pulse rounded-lg bg-[#f3f4f6]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center">
          <p className="mb-4 text-sm text-[#6b7280]">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="rounded-xl bg-[#eb4799] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#d43589]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and saved data."
      />

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        {/* Avatar row */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-[#e5e7eb]">
                {profile?.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#00252e] text-xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#eb4799] text-white shadow-sm transition-colors hover:bg-[#d43589]">
                {photoLoading ? (
                  <svg
                    className="h-3 w-3 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <Camera size={12} />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhotoUpload(f);
                  }}
                />
              </label>
            </div>
            <div>
              <p className="text-lg font-bold text-[#111827]">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
                  : profile?.username}
              </p>
              <p className="text-sm text-[#6b7280]">@{profile?.username}</p>
            </div>
          </div>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-3 py-2 text-xs font-semibold text-[#374151] transition-colors hover:border-[#eb4799] hover:text-[#eb4799]"
            >
              <Edit2 size={13} /> Edit
            </button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="firstName"
                label="First Name"
                value={newFirstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewFirstName(e.target.value)
                }
                placeholder="First name"
              />
              <Input
                id="lastName"
                label="Last Name"
                value={newLastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewLastName(e.target.value)
                }
                placeholder="Last name"
              />
            </div>
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={newEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewEmail(e.target.value)
              }
              placeholder="you@example.com"
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#374151]">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="text-sm text-[#374151]"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setNewPhoto(f);
                }}
              />
              {newPhoto && (
                <p className="text-xs text-[#6b7280]">
                  Selected: {newPhoto.name}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <PrimaryButton
                loading={saving}
                loadingText="Saving..."
                onClick={handleUpdateProfile}
              >
                <Check size={15} /> Save Changes
              </PrimaryButton>
              <button
                onClick={() => {
                  setEditMode(false);
                  setNewPhoto(null);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#f3f4f6]"
              >
                <X size={15} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 border-t border-[#f3f4f6] pt-5">
            {[
              { label: 'Email', value: profile?.email },
              { label: 'Username', value: profile?.username },
              {
                label: 'User ID',
                value: String(profile?.id ?? 'N/A'),
                mono: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-[#f9fafb]"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                  {row.label}
                </span>
                <span
                  className={`text-sm text-[#111827] ${row.mono ? 'font-mono text-xs' : ''}`}
                >
                  {row.value ?? 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved data */}
      <div className="mt-5 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
          Saved Data
        </p>
        <p className="text-sm italic text-[#9ca3af]">
          No saved items yet. Start exploring to save your preferences!
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
