import { history } from 'store';

import { JSONRequest } from 'api';

import { showAlert } from 'modules/alerts';
import { USER_CREATE } from '../constants';

export default function (data) {
  return (dispatch) => {
    const credentials = { login: data.login.trim().toLowerCase() }

    JSONRequest('/api/users', credentials)
      .then(response => response.json())
      .then((payload) => {
        dispatch({
          type: USER_CREATE,
          payload,
        });
        dispatch(showAlert('Новый пользователь создан', 'success'));
        history.push('/users/all');
      });
  };
}
