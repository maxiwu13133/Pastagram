import { useState } from 'react';
import { AsyncImage } from 'loadable-image';
import { Blur } from 'transitions-kit';
import './index.css';

// assets
import cycleArrow from '../../assets/Preview/next-img-arrow.png';

const Preview = ({ files, home }) => {
  const [previewIndex, setPreviewIndex] = useState(0);

  const optimizeImage = (photo) => {
    const [first, second] = photo.split('upload');
    const transformation = 'upload/h_523,w_466,c_fill/f_auto';
    return first + transformation + second;
  }

  return ( 
    <div className="preview-container">
      { previewIndex !== 0 && 
        <div className="preview-back-img" onClick={ () => setPreviewIndex(previewIndex - 1) }>
          <img src={ cycleArrow } alt="prev img" className="preview-back-arrow" />
        </div>
      }
      <div className="preview-img-container">
        {
          home && 
          <AsyncImage
            alt="photos"
            src={ optimizeImage(files[previewIndex].url) } 
            Transition={ Blur }
            loader={ <div style={{ background: '#888' }} /> }
            draggable={ false }
            className="preview-img"
            timeout={ 500 }
          />
        }
        {
          !home && 
          <img 
          draggable={ false } 
          className="preview-img" 
          src={ files[previewIndex].url } 
          alt="photos" 
        />
        }
      </div>
      { files.length > 1 && previewIndex !== files.length - 1 && 
        <div className="preview-next-img" onClick={ () => setPreviewIndex(previewIndex + 1) }>
          <img src={ cycleArrow } alt="next img" className="preview-next-arrow" />
        </div> 
      }
      { files.length > 1 && 
        <div className="preview-img-index">
          { files.map((_, index) => <div 
            className={`preview-img-index-dot ${ previewIndex === index ? "preview-img-index-dot-highlighted" : "" }` }
            key={ index }
          />) }
        </div>
      }
    </div>
   );
}
 
export default Preview;