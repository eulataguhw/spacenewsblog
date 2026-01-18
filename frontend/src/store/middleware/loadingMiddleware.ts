import {
  Middleware,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { startLoading, stopLoading } from "../uiSlice";

export const loadingMiddleware: Middleware = (store) => (next) => (action) => {
  // Check if the action is from an API call
  if (isPending(action)) {
    store.dispatch(startLoading());
  } else if (isFulfilled(action) || isRejected(action)) {
    store.dispatch(stopLoading());
  }

  return next(action);
};
