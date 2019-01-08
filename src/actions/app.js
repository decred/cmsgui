import Promise from "promise";
import { reset } from "redux-form";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import {
  onChangeUsername,
  onChangePassword,
  onSubmitEditedInvoice,
  onSubmitInvoice
} from "./api";
import { resetNewInvoiceData } from "../lib/editors_content_backup";
import * as sel from "../selectors";
import act from "./methods";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";
import { onLogout, onEditUser, cleanErrors } from "./api";
import { loadStateLocalStorage, loggedInStateKey } from "../lib/local_storage";

export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onRouteChange = () => dispatch => {
  dispatch(cleanErrors());
};

export const onSetReplyParent = (
  parentId = TOP_LEVEL_COMMENT_PARENTID
) => dispatch =>
  Promise.all([
    dispatch(act.SET_REPLY_PARENT(parentId)),
    dispatch(reset("form/reply"))
  ]);

export const onSaveNewInvoice = ({ month, year, csv, signature }, _, props) => (
  dispatch,
  getState
) => {
  dispatch(
    onSubmitInvoice(
      props.loggedInAsEmail,
      props.userid,
      month,
      year,
      csv,
      props.publickey,
      signature
    )
  ).then(() => sel.newInvoiceToken(getState()));
};

export const onEditInvoice = (
  { month, year, file, signature },
  _,
  props
) => dispatch =>
  dispatch(
    onSubmitEditedInvoice(
      props.loggedInAsEmail,
      props.userid,
      month,
      year,
      file,
      props.publickey,
      signature,
      props.token
    )
  );

export const onSaveDraftInvoice = ({ name, description, files, draftId }) => {
  resetNewInvoiceData();
  return act.SAVE_DRAFT_INVOICE({
    name: name.trim(),
    description,
    files,
    timestamp: Date.now() / 1000,
    draftId
  });
};

export const onLoadDraftInvoices = email => {
  const stateFromLS = loadStateLocalStorage(email);
  const drafts = sel.draftInvoices(stateFromLS) || {};
  return act.LOAD_DRAFT_INVOICES(drafts);
};

export const onDeleteDraftInvoice = draftId =>
  act.DELETE_DRAFT_INVOICE(draftId);

export const onSaveChangeUsername = ({ password, newUsername }) => (
  dispatch,
  getState
) =>
  dispatch(onChangeUsername(password, newUsername)).then(() =>
    sel.newInvoiceToken(getState())
  );

export const onSaveChangePassword = ({ existingPassword, newPassword }) => (
  dispatch,
  getState
) =>
  dispatch(onChangePassword(existingPassword, newPassword)).then(() =>
    sel.newInvoiceToken(getState())
  );

export const onLoadMe = me => dispatch => {
  dispatch(act.LOAD_ME(me));
};

export const onChangeAdminFilter = option =>
  act.CHANGE_ADMIN_FILTER_VALUE(option);
export const onChangePublicFilter = option =>
  act.CHANGE_PUBLIC_FILTER_VALUE(option);
export const onChangeUserFilter = option =>
  act.CHANGE_USER_FILTER_VALUE(option);

export const onIdentityImported = (successMsg, errorMsg = "") =>
  act.IDENTITY_IMPORTED({ errorMsg, successMsg });

export const onLocalStorageChange = event => (dispatch, getState) => {
  const state = getState();

  if (event.key !== loggedInStateKey) {
    return;
  }

  const apiMeResponse = sel.apiMeResponse(state);

  try {
    const stateFromStorage = JSON.parse(event.newValue);
    const apiMeFromStorage = get(stateFromStorage, ["api", "me"], undefined);
    const apiMeResponseFromStorage = sel.apiMeResponse(stateFromStorage);

    if (
      apiMeResponseFromStorage &&
      !isEqual(apiMeResponseFromStorage, apiMeResponse)
    ) {
      dispatch(onLoadMe(apiMeFromStorage));
    } else if (!stateFromStorage || (stateFromStorage && !apiMeFromStorage))
      dispatch(act.RECEIVE_LOGOUT({}));
  } catch (e) {
    dispatch(onLogout());
  }
};

export const setOnboardAsViewed = () => act.SET_ONBOARD_AS_VIEWED();

export const onSetCommentsSortOption = option =>
  act.SET_COMMENTS_SORT_OPTION(option);

export const onEditUserPreferences = () => dispatch => dispatch(onEditUser());
