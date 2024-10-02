import { ReplyTargetContext } from '../context/ReplyTargetContext';
import { useContext } from 'react';

export const useReplyTargetContext = () => {
  const context = useContext(ReplyTargetContext);

  if (!context) {
    throw Error('useReplyTargetContext must be used inside a ReplyTargetContextProvider');
  };

  return context;
};
