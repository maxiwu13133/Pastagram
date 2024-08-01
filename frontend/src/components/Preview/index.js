import { useState } from 'react';
import './index.css';


const Preview = ({ files }) => {
  const [previewIndex, setPreviewIndex] = useState(0);

  return ( 
    <div className="preview-container">
      <img className="preview-img" src={ URL.createObjectURL(files[previewIndex]) } alt="photos" />
    </div>
   );
}
 
export default Preview;