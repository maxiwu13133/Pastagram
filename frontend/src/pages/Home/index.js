import { useState, useEffect } from 'react';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useHomeLoadContext } from '../../hooks/useHomeLoadContext';
import { useDeletedContext } from '../../hooks/useDeletedContext';
import { useNavbarContext } from '../../hooks/useNavbarContext';


// pages
import Loading from '../Loading';


// components
import HomePost from '../../components/HomePost';
import Suggest from '../../components/Suggest';


// assets
import icon from '../../assets/Logos/pastagram-icon.png';


const Home = () => {
  const { user } = useAuthContext();
  const { userInfoLoad, suggestedLoad, postLoad, deletedLoad, dispatch } = useHomeLoadContext();
  const { dispatch: dispatchNav } = useNavbarContext();


  // deleted users
  const { deletedUsers } = useDeletedContext();

  useEffect(() => {
    if (deletedUsers) {
      dispatch({ type: 'DELETED_FINISH' });
      dispatchNav({ type: 'SET_NAV', payload: '' });
    }
  }, [deletedUsers, dispatch, dispatchNav]);

  
  // wait for all content to load before display
  const [homeLoad, setHomeLoad] = useState(false);

  useEffect(() => {
    if (userInfoLoad && suggestedLoad && postLoad && deletedLoad) {
      setHomeLoad(true);
    };
  }, [userInfoLoad, suggestedLoad, postLoad, deletedLoad]);


  // grab posts of following
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getHomePosts = async () => {
  
      const response = await fetch('http://localhost:4000/api/post/friends/' + user.username, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ user.token }`
        }
      });
      const json = await response.json();
  
      if (!response.ok) {
        console.log('Error:', json.error);
      };
      if (response.ok && deletedUsers) {
        const deletedRemoved = json.allPosts.filter(x => !deletedUsers.includes(x.user_id));


        const sortedJson = deletedRemoved.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setPosts(sortedJson);

        dispatch({ type: 'POST_FINISH' });

        if (deletedRemoved.length === 0) {
          dispatch({ type: 'USER_FINISH' });
        };
      };
    };

    getHomePosts();
  }, [user, dispatch, deletedUsers]);


  return (
    <div className="home-page-container">
      {/* Load Screen */}
      {
        !homeLoad && <Loading />
      }

      {/* Home */}
      <div className="home-contents-container">
        {
          posts.length > 0 && 
          <div className="home-posts-container">
            {
              posts.map((post, i) => <HomePost post={ post } key={ i } />)
            }
          </div>
        }
        {
          posts.length === 0 && 
          <div className="home-empty-posts">
            <img src={ icon } alt="" className="home-empty-icon" />

            <p className="home-empty-text">Looks empty...</p>
            <p className="home-empty-subtext">Use Search and Explore to find accounts.</p>
          </div>
        }
  
        <div className="home-suggest">
          <Suggest />
        </div>
      </div>
    </div>
  );
};

export default Home;
