import { HAMBEGER_CLOSE, HAMBEGER_OPEN } from "../reducer/hambegeReducer";
import { MODAL_CLOSED, MODAL_OPENED } from "../reducer/modalReducer";
import { BOOKMARKED, SETINITIALVALUE, UNBOOKMARKED } from "../reducer/reducer";
import { CLOSE_TOAST, SHOW_TOAST } from "../reducer/toastReducer";

//bookmarkReducer
export const dispatchData = (data) => {
  return {
    type: SETINITIALVALUE,
    data,
  };
};

export const dispatchBookmark = (id) => {
  return {
    type: BOOKMARKED,
    id,
  };
};

export const dispatchUnBookmark = (id) => {
  return {
    type: UNBOOKMARKED,
    id,
  };
};
// hambeger Reducer
export const dispatchHambeger = () => {
  return {
    type: HAMBEGER_OPEN,
  };
};

export const dispatchHambegerClose = () => {
  return {
    type: HAMBEGER_CLOSE,
  };
};

//toastReducer
export const dispatchToastOpen = (isBookmarked, id) => {
  return (dispatch) => {
    dispatch({ type: SHOW_TOAST, isBookmarked, id });
    setTimeout(() => {
      dispatch({ type: CLOSE_TOAST, isBookmarked, id });
    }, 2000);
  };
};

//modalReducer

export const dispatchModalOpen = (id, image, title, bookmark) => ({
  type: MODAL_OPENED,
  id,
  image,
  bookmark,
  title,
});

export const dispatchModalClose = () => ({ type: MODAL_CLOSED });
