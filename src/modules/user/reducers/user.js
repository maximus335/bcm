import { AUTH_CHECK, LOGOUT, SIGN_IN } from '../constants';

export default function reducer(state = { fetching: true }, { type, payload }) {
  switch (type) {
    case AUTH_CHECK:
      return payload || {};

    case SIGN_IN:
      return payload;

    case LOGOUT:
      return {};

    default:
      return state;
  }
}
