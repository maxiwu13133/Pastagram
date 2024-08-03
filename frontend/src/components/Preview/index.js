import { useState } from 'react';
import './index.css';

// assets
import cycleArrow from '../../assets/Preview/next-img-arrow.png';

const Preview = ({ files }) => {
  const [previewIndex, setPreviewIndex] = useState(0);


  return ( 
    <div className="preview-container">
      { previewIndex !== 0 && 
        <div className="preview-back-img" onClick={ () => setPreviewIndex(previewIndex - 1) }>
          <img src={ cycleArrow } alt="prev img" className="preview-back-arrow" />
        </div>
      }
      <img 
        draggable={ false } 
        className="preview-img" 
        src={ files[previewIndex].preview } 
        alt="photos" 
      />
      { files.length > 1 && previewIndex !== files.length - 1 && 
        <div className="preview-next-img">
          <img 
            src={ cycleArrow } 
            alt="next img" 
            className="preview-next-arrow" 
            onClick={ () => setPreviewIndex(previewIndex + 1) }
          />
        </div> 
      }
    </div>
   );
}
 
export default Preview;