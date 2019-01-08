import { reducer } from "redux-form";
import * as act from "../actions/types";

const formReducer = reducer.plugin({
  "form/invoice": (state, action) => {
    switch (action.type) {
      case act.RECEIVE_NEW_INVOICE:
        if (action.error) {
          return state;
        }
        return undefined;
      case act.RECEIVE_EDIT_INVOICE:
        if (action.error) {
          return state;
        }
        return undefined;
      case act.SAVE_DRAFT_INVOICE:
        return undefined;
      default:
        return state;
    }
  },
  "form/change-username": (state, action) => {
    switch (action.type) {
      case act.RECEIVE_CHANGE_USERNAME:
        return !action.error ? undefined : state;
      default:
        return state;
    }
  },
  "form/change-password": (state, action) => {
    switch (action.type) {
      case act.RECEIVE_CHANGE_PASSWORD:
        return !action.error ? undefined : state;
      default:
        return state;
    }
  }
});

export default formReducer;
