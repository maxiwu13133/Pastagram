// import { useState } from 'react';
import { useParams } from 'react-router-dom';


const Profile = () => {
  const { username } = useParams();

  return ( 
    <div className="profile-container">
      { username }
    </div>
   );
};
 
export default Profile;
