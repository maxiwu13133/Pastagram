import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import './index.css';


// assets
import closeButton from '../../assets/PostView/close-button-black.png';
import magnifyGlass from '../../assets/Navbar/ig-search-icon-unfocused.png';
import circleClose from '../../assets/Search/circle-close.png';
import defaultPfp from '../../assets/Profile/default-pfp.jpg';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useDeletedContext } from '../../hooks/useDeletedContext';
import { useFollowUser } from '../../hooks/useFollowUser';
import { useUnfollowUser } from '../../hooks/useUnfollowUser';
import { useFollowingContext } from '../../hooks/useFollowingContext';


const FriendsModal = ({ setFriendsModal, type, followers, following }) => {
  const { user } = useAuthContext();

  // deleted users
  const { deletedUsers } = useDeletedContext();

  // search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // results
  const [results, setResults] = useState([]);


  // debounce search for optimization
  useEffect(() => {
    if (debouncedSearch) {
      const searchUsers = async (value) => {
        const processedValue = value.toLowerCase().replace(/\s+/g, '');
        if (processedValue.length !== 0) {
          const response = await fetch('http://localhost:4000/api/search/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ user.token }`
            }
          })
          const json = await response.json();

          if (!response.ok) {
            console.log('Error:', json.error);
          }
          if (response.ok) {
            const deletedRemoved = json.users.filter(x => !deletedUsers.includes(x._id));
            const filteredResults = deletedRemoved.filter(x => x.username.toLowerCase().includes(processedValue));

            if (type === 'Followers') {
              setResults(filteredResults.filter(x => followers.includes(x._id)));
            }

            if (type === 'Following') {
              setResults(filteredResults.filter(x => following.includes(x._id)));
            }
          }
        }
      }
      searchUsers(debouncedSearch);
    }
  }, [debouncedSearch, user.token, deletedUsers, followers, following, type]);


  // show all followers or following
  const [followerList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const { followingListGlobal, dispatch } = useFollowingContext();

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch('http://localhost:4000/api/user/friends/' + user.username, {
        method: 'GET'
      });
      const json = await response.json();

      if (!response.ok) {
        console.log('Error:', json.error);
      }

      if (response.ok) {
        setFollowersList(json.followers);
        setFollowingList(json.following);
      }
    }

    getFriends();
  }, [followers, type, user]);


  // handle follow
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  const handleFollow = async (friend, i) => {
    if (followingListGlobal.includes(friend._id)) {
      dispatch({ type: 'REMOVE_FOLLOWING', payload: friend._id });
      await unfollowUser({ username: user.username, targetUsername: friend.username });
    }
    else if (!followingListGlobal.includes(friend._id)) {
      dispatch({ type: 'ADD_FOLLOWING', payload: friend._id });
      await followUser({ username: user.username, targetUsername: friend.username });
    }
  }


  // show followers
  const formatFriend = (friend, i) => {
    return (
      <div className="friends-result-user" key={ i }>
        <img 
          src={ friend.pfp ? friend.pfp.url : defaultPfp }
          alt=""
          className="friends-result-pfp"
          draggable={ false }
        />

        <div className="friends-result-options">
          <p className="friends-result-username">{ friend.username }</p>
          <p className="friends-result-fullname">{ friend.fullName }</p>
        </div>

        <div className="friends-result-follow-container">
          <button 
            className={ `
              friends-result-button
              ${ followingListGlobal.includes(friend._id) ? "friends-result-following" : "" } 
            ` }
            onClick={ () => handleFollow(friend, i) }
          >
            {
              followingListGlobal.includes(friend._id) ? "Following" : "Follow"
            }
          </button>
        </div>
      </div>
    )
  }


  return (
    <div>
      <div className="friends-overlay" onClick={ () => setFriendsModal(false) } />

      <div className="friends-container">

        {/* header */}
        <div className="friends-header">
          <p className="friends-title">
            { type }
          </p>

          <div className="friends-close">
            <img 
              src={ closeButton }
              alt=""
              className="friends-close-icon"
              draggable={ false }
              onClick={ () => setFriendsModal(false) }
            />
          </div>
        </div>

        {/* search */}
        <div className="friends-search">
          <div className="friends-input-container">
            <img 
              src={ magnifyGlass }
              alt=""
              className={ `friends-input-icon ${ searchTerm === '' ? "" : "remove" }` }
              draggable={ false }
            />

            <input 
              type="text"
              className="friends-input"
              placeholder="Search"
              onChange={ (e) => setSearchTerm(e.target.value) }
              value={ searchTerm }
            />

            <div className="friends-input-close-container">
              <img
                src={ circleClose }
                alt=""
                className={ `friends-input-close ${ searchTerm === '' ? "remove" : "" }` }
                draggable={ false }
              />
            </div>
          </div>
        </div>

        {/* results */}
        <div className="friends-results">
          {
            searchTerm.replace(/\s+/g, '').length === 0 &&
            type === "Followers" ? 
            followerList.map((follower, i) => formatFriend(follower, i)) :
            followingList.map((following, i) => formatFriend(following, i))
          }
        </div>
      </div>
    </div>
  )
}

export default FriendsModal;