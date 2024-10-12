import { useState, useEffect } from 'react';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useHomeLoadContext } from '../../hooks/useHomeLoadContext';


// pages
import Loading from '../Loading';


// components
import HomePost from '../../components/HomePost';
import Suggest from '../../components/Suggest';


const Home = () => {
  const { user } = useAuthContext();

  
  // wait for all content to load before display
  const { userInfoLoad, suggestedLoad, postLoad, dispatch } = useHomeLoadContext();
  const [homeLoad, setHomeLoad] = useState(false);

  useEffect(() => {
    if (userInfoLoad && suggestedLoad && postLoad) {
      setHomeLoad(true);
    };
  }, [userInfoLoad, suggestedLoad, postLoad]);


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
      if (response.ok) {
        const sortedJson = json.allPosts.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setPosts(sortedJson);

        dispatch({ type: 'POST_FINISH' });

        if (json.allPosts.length === 0) {
          dispatch({ type: 'USER_FINISH' });
        };
      };
    };

    getHomePosts();
  }, [user, dispatch]);


  return (
    <div className="home-page-container">
      {/* Load Screen */}
      {
        !homeLoad && <Loading />
      }

      {/* Home */}
      <div className="home-contents-container">
        <div className="home-posts-container">
          {
            posts.length > 0 && posts.map((post, i) => <HomePost post={ post } key={ i } />)
          }
          {
            posts.length === 0 && <div className="home-empty-posts">

            </div>
          }
        </div>
  
        <div className="home-suggest">
          <Suggest />
        </div>
      </div>
    </div>
  );
};

export default Home;
