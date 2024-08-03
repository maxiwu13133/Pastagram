import { useState } from 'react';
import './index.css';


const Preview = ({ files }) => {
  const [previewIndex, setPreviewIndex] = useState(0);

  return ( 
    <div className="preview-container">
      { previewIndex !== 0 && 
        <div className="preview-previous-img"></div>
      }
      <img draggable={ false } className="preview-img" src={ URL.createObjectURL(files[previewIndex]) } alt="photos" />
      { files.length > 1 && 
        <div className="preview-next-img"></div> 
      }
    </div>
   );
}
 
export default Preview;