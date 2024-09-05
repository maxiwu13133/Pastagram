import { useState } from 'react';


export const useGetUserInfo = () => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pfp, setPfp] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  
  const getUserInfo = async (username) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch('http://localhost:4000/api/user/community/' + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    };

    if (response.ok) {
      setId(json._id);
      setEmail(json.email);
      setFullName(json.fullName);
      setBio(json.bio);
      setFollowers(json.followers);
      setFollowing(json.following);
      setPfp(json.pfp);
      setIsLoading(false);
    };
  };
}