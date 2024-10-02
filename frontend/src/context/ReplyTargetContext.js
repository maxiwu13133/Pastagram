import { createContext, useReducer } from 'react';

export const ReplyTargetContext = createContext();

export const replyTargetReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TARGET':
      return { 
        commentId: action.payload.commentId,
        replyTarget: action.payload.replyTarget,
        flash: null,
        newReplies: state.newReplies
      };
    case 'REMOVE_TARGET':
      return {
        commentId: null,
        replyTarget: null,
        flash: null,
        newReplies: state.newReplies
      };
    case 'HIGHLIGHT': 
      return {
        commentId: state.commentId,
        replyTarget: state.replyTarget,
        flash: state.flash ? false : true,
        newReplies: state.newReplies
      };
    default:
      return state;
  };
};

export const ReplyTargetContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(replyTargetReducer, {
    commentId: null,
    replyTarget: null,
    flash: null,
  });

  return (
    <ReplyTargetContext.Provider value={{ ...state, dispatch }}>
      { children }
    </ReplyTargetContext.Provider>
  );
};
