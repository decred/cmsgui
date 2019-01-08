import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_UNLOCK,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_REACTIVATE
} from "../constants";

const userConnector = connect(
  sel.selectorMap({
    userId: compose(
      get(["match", "params", "userId"]),
      arg(1)
    ),
    loggedInAsUserId: sel.userid,
    user: sel.user,
    error: sel.apiUserError,
    isLoading: or(sel.isApiRequestingUser, sel.isApiRequestingMe),
    isLoadingInvoices: or(sel.userInvoicesIsRequesting),
    isTestnet: sel.isTestNet,
    loggedInAsEmail: sel.loggedInAsEmail,
    userInvoices: sel.getUserInvoices,
    isAdmin: sel.isAdmin,
    getSubmittedUserInvoices: sel.getSubmittedUserInvoices,
    identityImportError: sel.identityImportError,
    identityImportSuccess: sel.identityImportSuccess,
    keyMismatch: sel.getKeyMismatch,
    updateUserKey: sel.updateUserKey,
    updateUserKeyError: sel.updateUserKeyError,
    shouldAutoVerifyKey: sel.shouldAutoVerifyKey,
    verificationToken: sel.verificationToken,
    userPubkey: sel.userPubkey,
    loggedInAsUsername: sel.loggedInAsUsername,
    isApiRequestingMarkAsPaid: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_CLEAR_USER_PAYWALL,
    isApiRequestingMarkNewUserAsExpired: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
    isApiRequestingMarkUpdateKeyAsExpired: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) ===
        MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
    isApiRequestingMarkResetPasswordAsExpired: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) ===
        MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
    isApiRequestingUnlockUser: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_UNLOCK,
    isApiRequestingDeactivateUser: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_DEACTIVATE,
    isApiRequestingReactivateUser: state =>
      sel.isApiRequestingManageUser(state) &&
      sel.manageUserAction(state) === MANAGE_USER_REACTIVATE,
    manageUserResponse: sel.manageUserResponse,
    numOfUserInvoices: sel.numOfUserInvoices
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUser,
        onFetchUserInvoices: act.onFetchUserInvoices,
        openModal: act.openModal,
        closeModal: act.closeModal,
        keyMismatchAction: act.keyMismatch,
        onIdentityImported: act.onIdentityImported,
        confirmWithModal: act.confirmWithModal,
        onUpdateUserKey: act.onUpdateUserKey,
        onManageUser: act.onManageUser
      },
      dispatch
    )
);

export default compose(
  withRouter,
  userConnector
);
