import { combineReducers } from 'redux';

import auth from './auth';
import profile from './user';
import timeline from './timeline';
import entities from './entities';
import pagination from './pagination';

const combinedReducer = combineReducers({
  entities,
  pagination,
  auth,
  // profile,
  // timeline,
});

export default combinedReducer;
