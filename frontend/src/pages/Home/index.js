import { useState, useEffect } from 'react';
import './index.css';


// hooks
import { useAuthContext } from '../../hooks/useAuthContext';


// pages
import Loading from '../Loading';


// components
import HomePost from '../../components/HomePost';


const Home = () => {
  const { user } = useAuthContext();

  // grab posts of following
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
        console.log('Error:', json.error);
      };
      if (response.ok) {
        setIsLoading(false);

        const sortedJson = json.allPosts.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

        setPosts(sortedJson.reverse());
      };
    };

    getHomePosts();
  }, [user]);


  return (
    <div className="home-page-container">
      {/* Load Screen */}
      {
        isLoading && <Loading />
      }

      {/* Home */}
      {
        !isLoading &&
        <div className="home-contents-container">
          <div className="home-posts-container">
            {
              posts.map((post, i) => <HomePost post={ post } key={ i } />)
            }
          </div>
    
          <div className="home-suggested-accounts">
    
          </div>
        </div>
      }
    </div>
  );
};

export default Home;
