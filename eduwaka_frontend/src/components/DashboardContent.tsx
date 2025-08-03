import { useEffect, useState, type JSX } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, EditIcon, ListChecks, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/button';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  description,
  icon,
  onClick,
}: DashboardCardProps) => (
  <button
    onClick={onClick}
    className="block w-full transform rounded-lg bg-white p-6 text-left shadow-md transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      {icon}
    </div>
    <h4 className="mb-2 text-xl font-semibold text-gray-900">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);

// UserProfileData for Django User/UserProfile model
interface UserProfileData {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const DashboardContent = () => {
  const navigate = useNavigate();

  const { user } = useAuth(); // Get user from context
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string>('');

  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        setProfileError('User not authenticated.');
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoadingProfile(false);
        setProfileError('Authentication token missing. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`${DJANGO_API_BASE_URL}profile/`, {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        setProfileError(error.message || 'Failed to load profile data.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Re-fetch if user object changes after login/logout

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Welcome to EduWaka!
      </h2>
      <p className="mb-8 text-lg text-gray-700">
        Your personalized guide to university admissions in Nigeria.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Quick Search"
          description="Find institutions and courses quickly."
          icon={<Search size={24} />}
          onClick={() => navigate('searchInstitutions/')}
        />
        <DashboardCard
          title="Eligibility Check"
          description="See if you meet course requirements with AI."
          icon={<ListChecks size={24} />}
          onClick={() => navigate('eligibilityCheckerAI/')}
        />
        <DashboardCard
          title="Exam Prep"
          description="Tools to help you prepare for CBT exams."
          icon={<BookOpen size={24} />}
        />
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-6 shadow-inner">
        <div className="flex justify-between">
          <h3 className="mb-4 text-xl font-semibold text-blue-800">
            Your Profile Summary{' '}
          </h3>
          <div className="group relative inline-block">
            <Button variant="ghost" className="cursor-pointer">
              <EditIcon size={20} />
            </Button>
            <div className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 scale-0 transform rounded bg-gray-800 px-2 py-1 text-sm text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
              Edit Profile
            </div>
          </div>
        </div>

        {loadingProfile ? (
          <p className="text-blue-700">Loading profile...</p>
        ) : profileError ? (
          <p className="text-red-600">{profileError}</p>
        ) : profile ? (
          <>
            <p className="text-gray-700">
              <span className="font-medium">Username:</span> {profile.username}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {profile.email}
            </p>
            {profile.first_name && (
              <p className="text-gray-700">
                <span className="font-medium">First Name:</span>{' '}
                {profile.first_name}
              </p>
            )}
            {profile.last_name && (
              <p className="text-gray-700">
                <span className="font-medium">Last Name:</span>{' '}
                {profile.last_name}
              </p>
            )}

            <p className="text-gray-700">
              <span className="font-medium">Your User ID:</span>{' '}
              <span className="break-all font-mono text-sm">{profile.id}</span>
            </p>
          </>
        ) : (
          <p className="text-red-600">Profile data not available.</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          What's New?
        </h3>
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li>New institutions added to our database!</li>
          <li>Improved JAMB subject combination checker.</li>
          <li>Interactive CBT practice questions coming soon!</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
