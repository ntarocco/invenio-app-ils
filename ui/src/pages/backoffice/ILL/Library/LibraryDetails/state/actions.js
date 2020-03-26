import {
  HAS_ERROR,
  IS_LOADING,
  SUCCESS,
  DELETE_SUCCESS,
  DELETE_HAS_ERROR,
  DELETE_IS_LOADING,
} from './types';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { illLibrary as libraryApi } from '@api';

export const fetchLibraryDetails = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await libraryApi.get(pid);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const deleteLibrary = pid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    await libraryApi
      .delete(pid)
      .then(response => {
        dispatch({
          type: DELETE_SUCCESS,
          payload: { pid: pid },
        });
        dispatch(
          sendSuccessNotification(
            'Success!',
            `The library ${pid} has been deleted.`
          )
        );
      })
      .catch(error => {
        dispatch({
          type: DELETE_HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };
};
