import './index.css';

// assets
import upload from '../../assets/Create/upload-pic.png';

const Create = () => {

  return (
    <div className="create-post">
      <header className="create-post-header">
        <p>Create new post</p>
      </header>

      <div className="create-post-photo">
        <img className="create-post-upload" src={ upload } alt="upload" />
      </div>

      <div className="create-post-tooltip">
        Drag photos and videos here
      </div>
      
      <button className="create-post-select-from-pc">
        Select from computer
      </button>
      
    </div>
  );
};


export default Create;
