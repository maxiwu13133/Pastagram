import './index.css';

// Assets
import logo from '../../assets/Logos/pastagram-icon.png';


const Loading = () => {
  return (
    <div className="loading-background">
      <img src={ logo } alt="Loading" className="loading-icon" />
      <div className="loading-description-first-line">from</div>
      <div className="loading-description-second-line">Max</div>
    </div>
  );
};
 
export default Loading;