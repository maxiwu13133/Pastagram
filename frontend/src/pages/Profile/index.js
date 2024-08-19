import { useState, useEffect } from 'react';
import './index.css';

// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';

// Pages
import SelfProfile from './SelfProfile';
import UserProfile from './UserProfile';


const Profile = () => {
  const { user } = useAuthContext();
  const [selfProfile, setSelfProfile] = useState(null);
  const [username, setUsername] = useState('');

  // Check if self profile or another user profile
  useEffect(() => {
    const pathName = window.location.pathname.replace(/\//g,'')
    if (pathName === user.username) {
      setSelfProfile(true);
    } else {
      setUsername(pathName);
      setSelfProfile(false);
    };
  }, [user.username])


  return ( 
    <div className="profile-container">
      { selfProfile && <SelfProfile /> }
      { !selfProfile && <UserProfile username={ username } /> }
    </div>
   );
};
 
export default Profile;
