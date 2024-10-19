import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import eventReducer from "./slices/eventSlice";

const rootReducer = combineReducers({
  user: userReducer,
  events: eventReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
