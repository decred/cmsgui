import * as act from "../../actions/types";
import { DEFAULT_REQUEST_STATE, request, receive, reset } from "../util";
import {
  onReceiveInvoices,
  onReceiveUser,
  onReceiveManageUser
} from "./handlers";

export const DEFAULT_STATE = {
  me: DEFAULT_REQUEST_STATE,
  init: DEFAULT_REQUEST_STATE,
  policy: DEFAULT_REQUEST_STATE,
  newUser: DEFAULT_REQUEST_STATE,
  verifyNewUser: DEFAULT_REQUEST_STATE,
  login: DEFAULT_REQUEST_STATE,
  logout: DEFAULT_REQUEST_STATE,
  userInvoices: DEFAULT_REQUEST_STATE,
  newInvoice: DEFAULT_REQUEST_STATE,
  editInvoice: DEFAULT_REQUEST_STATE,
  newComment: DEFAULT_REQUEST_STATE,
  forgottenPassword: DEFAULT_REQUEST_STATE,
  passwordReset: DEFAULT_REQUEST_STATE,
  inviteUser: DEFAULT_REQUEST_STATE,
  changeUsername: DEFAULT_REQUEST_STATE,
  changePassword: DEFAULT_REQUEST_STATE,
  updateUserKey: DEFAULT_REQUEST_STATE,
  verifyUserKey: DEFAULT_REQUEST_STATE,
  userSearch: DEFAULT_REQUEST_STATE,
  email: "",
  keyMismatch: false,
  lastLoaded: {}
};

const api = (state = DEFAULT_STATE, action) =>
  (({
    [act.SET_EMAIL]: () => ({ ...state, email: action.payload }),
    [act.CLEAN_ERRORS]: () =>
      Object.keys(state).reduce((acc, curr) => {
        if (typeof state[curr] === "object") {
          acc[curr] = Object.assign({}, state[curr], { error: null });
        } else {
          acc[curr] = state[curr];
        }
        return acc;
      }, {}),
    [act.LOAD_ME]: () => {
      return {
        ...state,
        me: action.payload
      };
    },
    [act.REQUEST_ME]: () => request("me", state, action),
    [act.RECEIVE_ME]: () => receive("me", state, action),
    [act.UPDATE_ME]: () => receive("me", state, action),
    [act.REQUEST_INIT_SESSION]: () => request("init", state, action),
    [act.RECEIVE_INIT_SESSION]: () => receive("init", state, action),
    [act.REQUEST_POLICY]: () => request("policy", state, action),
    [act.RECEIVE_POLICY]: () => receive("policy", state, action),
    [act.REQUEST_NEW_USER]: () => request("newUser", state, action),
    [act.RECEIVE_NEW_USER]: () => receive("newUser", state, action),
    [act.REQUEST_INVITE_USER]: () => request("inviteUser", state, action),
    [act.RECEIVE_INVITE_USER]: () => receive("inviteUser", state, action),
    [act.RESET_NEW_USER]: () => reset("newUser", state),
    [act.REQUEST_VERIFY_NEW_USER]: () =>
      request("verifyNewUser", state, action),
    [act.RECEIVE_VERIFY_NEW_USER]: () =>
      receive("verifyNewUser", state, action),
    [act.REQUEST_USER]: () => request("user", state, action),
    [act.RECEIVE_USER]: () => onReceiveUser(state, action),
    [act.REQUEST_LOGIN]: () => request("login", state, action),
    [act.RECEIVE_LOGIN]: () => receive("login", state, action),
    [act.REQUEST_CHANGE_USERNAME]: () =>
      request("changeUsername", state, action),
    [act.RECEIVE_CHANGE_USERNAME]: () =>
      receive("changeUsername", state, action),
    [act.REQUEST_CHANGE_PASSWORD]: () =>
      request("changePassword", state, action),
    [act.RECEIVE_CHANGE_PASSWORD]: () =>
      receive("changePassword", state, action),
    [act.REQUEST_USER_INVOICES]: () => request("userInvoices", state, action),
    [act.RECEIVE_USER_INVOICES]: () =>
      onReceiveInvoices("userInvoices", state, action),
    [act.REQUEST_INVOICE]: () => request("invoice", state, action),
    [act.RECEIVE_INVOICE]: () => receive("invoice", state, action),
    [act.REQUEST_INVOICE_COMMENTS]: () =>
      request("invoiceComments", state, action),
    [act.RECEIVE_INVOICE_COMMENTS]: () =>
      receive("invoiceComments", state, action),
    [act.REQUEST_EDIT_USER]: () => request("editUser", state, action),
    [act.RECEIVE_EDIT_USER]: () => receive("editUser", state, action),
    [act.RECEIVE_EDIT_USER]: () => receive("editUser", state, action),
    [act.RESET_EDIT_USER]: () => reset("editUser", state, action),
    [act.REQUEST_MANAGE_USER]: () => request("manageUser", state, action),
    [act.RECEIVE_MANAGE_USER]: () => onReceiveManageUser(state, action),
    [act.REQUEST_NEW_INVOICE]: () => request("newInvoice", state, action),
    [act.RECEIVE_NEW_INVOICE]: () => receive("newInvoice", state, action),
    [act.REQUEST_USER_SEARCH]: () => request("userSearch", state, action),
    [act.RECEIVE_USER_SEARCH]: () => receive("userSearch", state, action),
    [act.REQUEST_EDIT_INVOICE]: () => request("editInvoice", state, action),
    [act.RECEIVE_EDIT_INVOICE]: () => receive("editInvoice", state, action),
    [act.REQUEST_FORGOTTEN_PASSWORD_REQUEST]: () =>
      request("forgottenPassword", state, action),
    [act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST]: () =>
      receive("forgottenPassword", state, action),
    [act.RESET_FORGOTTEN_PASSWORD_REQUEST]: () =>
      reset("forgottenPassword", state),
    [act.REQUEST_RESEND_VERIFICATION_EMAIL]: () =>
      request("resendVerificationEmail", state, action),
    [act.RECEIVE_RESEND_VERIFICATION_EMAIL]: () =>
      receive("resendVerificationEmail", state, action),
    [act.RESET_RESEND_VERIFICATION_EMAIL]: () =>
      reset("resendVerificationEmail", state),
    [act.REQUEST_PASSWORD_RESET_REQUEST]: () =>
      request("passwordReset", state, action),
    [act.RECEIVE_PASSWORD_RESET_REQUEST]: () =>
      receive("passwordReset", state, action),
    [act.REQUEST_INVITE_USER_REQUEST]: () =>
      request("inviteUser", state, action),
    [act.RECEIVE_INVITE_USER_REQUEST]: () =>
      receive("inviteUser", state, action),
    [act.REQUEST_UPDATED_KEY]: () => request("updateUserKey", state, action),
    [act.RECEIVE_UPDATED_KEY]: () => receive("updateUserKey", state, action),
    [act.REQUEST_VERIFIED_KEY]: () => request("verifyUserKey", state, action),
    [act.RECEIVE_VERIFIED_KEY]: () => receive("verifyUserKey", state, action),
    [act.KEY_MISMATCH]: () => ({ ...state, keyMismatch: action.payload }),
    [act.REQUEST_USERNAMES_BY_ID]: () =>
      request("usernamesById", state, action),
    [act.RECEIVE_USERNAMES_BY_ID]: () =>
      receive("usernamesById", state, action),
    [act.REQUEST_LOGOUT]: () => request("logout", state, action),
    [act.RECEIVE_LOGOUT]: () => {
      if (!action.error) {
        return {
          ...state,
          me: DEFAULT_REQUEST_STATE,
          logout: DEFAULT_REQUEST_STATE,
          login: DEFAULT_REQUEST_STATE,
          verifyNewUser: DEFAULT_REQUEST_STATE,
          passwordReset: DEFAULT_REQUEST_STATE,
          changePassword: DEFAULT_REQUEST_STATE,
          verifyUserKey: DEFAULT_REQUEST_STATE,
          inviteUser: DEFAULT_REQUEST_STATE
        };
      }
      return receive("logout", state, action);
    }
  }[action.type] || (() => state))());

export default api;
