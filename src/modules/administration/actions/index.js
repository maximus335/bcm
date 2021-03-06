import { request } from 'api';

import { USERS_INDEX } from '../constants';

export default function () {
  return (dispatch) => {
    request('/api/users')
      .then(response => response.json())
      .then((payload) => {
        dispatch({
          type: USERS_INDEX,
          payload,
        });
      });
  };
}
