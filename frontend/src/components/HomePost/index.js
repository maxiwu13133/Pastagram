import { useState, useEffect } from 'react';
import './index.css';


// components
import Preview from '../Preview';


const HomePost = ({ post }) => {
  return ( 
    <div className="homepost-container">
      <div className="homepost-header">

      </div>

      <div className="homepost-preview">
        <Preview files={ post.photos }/>
      </div>

      <div className="homepost-icons">
        
      </div>

      <div className="homepost-likes">

      </div>

      <div className="homepost-caption">

      </div>

      <div className="homepost-view-comments">

      </div>
    </div>
   );
}
 
export default HomePost;