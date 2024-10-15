import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';


// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';


// Pages
import SelfProfile from './SelfProfile';
import UserProfile from './UserProfile';


// context
import { ProfileLoadContextProvider } from '../../context/ProfileLoadContext';


const Profile = () => {
  const { user } = useAuthContext();
  const [selfProfile, setSelfProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { username } = useParams();

  // Check if self profile or another user profile
  useEffect(() => {
    if (username === user.username) {
      setSelfProfile(true);
      setUserProfile(null);
    } else {
      setUserProfile(true);
      setSelfProfile(null);
    };
  }, [username, user.username])


  return ( 
    <div className="profile-container">
      <ProfileLoadContextProvider>
        { selfProfile && <SelfProfile /> }
        { userProfile && <UserProfile username={ username } /> }
      </ProfileLoadContextProvider>
    </div>
   );
};
 
export default Profile;
