import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { or, bool, constant, not } from "../lib/fp";

export const getIsApiRequesting = key =>
  bool(get(["api", key, "isRequesting"]));
export const getApiPayload = key => get(["api", key, "payload"]);
export const getApiResponse = key => get(["api", key, "response"]);
export const getApiError = key => get(["api", key, "error"]);

export const isApiRequestingInit = getIsApiRequesting("init");
export const isApiRequestingUnvettedStatus = getIsApiRequesting(
  "unvettedStatus"
);
export const isApiRequestingMe = getIsApiRequesting("me");
const isApiRequestingPolicy = getIsApiRequesting("policy");
export const isApiRequestingNewUser = getIsApiRequesting("newUser");
export const isApiRequestingChangePassword = getIsApiRequesting(
  "changePassword"
);
export const isApiRequestingChangeUsername = getIsApiRequesting(
  "changeUsername"
);
export const isApiRequestingVerifyNewUser = getIsApiRequesting("verifyNewUser");
export const isApiRequestingLogin = getIsApiRequesting("login");
export const isApiRequestingLogout = getIsApiRequesting("logout");
export const isApiRequestingForgottenPassword = getIsApiRequesting(
  "forgottenPassword"
);
export const isApiRequestingResendVerificationEmail = getIsApiRequesting(
  "resendVerificationEmail"
);
export const isApiRequestingPasswordReset = getIsApiRequesting("passwordReset");
export const isApiRequestingInviteUser = getIsApiRequesting("inviteUser");
const isApiRequestingVetted = getIsApiRequesting("vetted");
const isApiRequestingUnvetted = getIsApiRequesting("unvetted");
const isApiRequestingUserInvoices = getIsApiRequesting("userInvoices");
const isApiRequestingInvoice = getIsApiRequesting("invoice");
const isApiRequestingNewInvoice = getIsApiRequesting("newInvoice");
export const isApiRequestingUserSearch = getIsApiRequesting("userSearch");
export const isApiRequestingUser = getIsApiRequesting("user");
export const isApiRequestingNewComment = getIsApiRequesting("newComment");
export const isApiRequestingSetStatusInvoice = getIsApiRequesting(
  "setStatusInvoice"
);
export const isApiRequestingEditUser = getIsApiRequesting("editUser");
export const isApiRequestingManageUser = getIsApiRequesting("manageUser");
export const isApiRequestingEditInvoice = getIsApiRequesting("editInvoice");

const apiNewUserPayload = getApiPayload("newUser");
const apiLoginPayload = getApiPayload("login");
const apiForgottenPasswordPayload = getApiPayload("forgottenPassword");
const apiResendVerificationEmailPayload = getApiPayload(
  "resendVerificationEmail"
);
const apiNewInvoicePayload = getApiPayload("newInvoice");
const apiSetStatusInvoicePayload = getApiPayload("setStatusInvoice");
const apiManageUserPayload = getApiPayload("manageUser");

export const apiMeResponse = getApiResponse("me");
export const apiUnvettedStatusResponse = getApiResponse("unvettedStatus");
const apiInitResponse = getApiResponse("init");
const apiPolicyResponse = getApiResponse("policy");
const apiNewUserResponse = getApiResponse("newUser");
export const apiUserResponse = getApiResponse("user");
export const apiChangePasswordResponse = getApiResponse("changePassword");
export const apiChangeUsernameResponse = getApiResponse("changeUsername");
export const apiLoginResponse = getApiResponse("login");
export const forgottenPasswordResponse = getApiResponse("forgottenPassword");
export const resendVerificationEmailResponse = getApiResponse(
  "resendVerificationEmail"
);
export const passwordResetResponse = getApiResponse("passwordReset");
export const inviteUserResponse = getApiResponse("inviteUser");
const apiUserInvoicesResponse = getApiResponse("userInvoices");
const apiInvoiceResponse = getApiResponse("invoice");
const apiNewInvoiceResponse = getApiResponse("newInvoice");
const apiSetStatusInvoiceResponse = getApiResponse("setStatusInvoice");
export const apiUserSearchResponse = getApiResponse("userSearch");
export const verifyNewUser = getApiResponse("verifyNewUser");
export const updateUserKey = getApiResponse("updateUserKey");
export const verifyUserKey = getApiResponse("verifyUserKey");
export const updateUserKeyError = getApiError("updateUserKey");
export const verifyUserKeyError = getApiError("verifyUserKey");
const apiCommentsLikesResponse = getApiResponse("commentslikes");
export const apiEditUserPayload = getApiPayload("editUser");
export const apiEditUserResponse = getApiResponse("editUser");
export const editUserError = getApiError("editUser");
export const manageUserResponse = getApiResponse("manageUser");

export const apiAuthorizeVoteResponse = getApiResponse("authorizeVote");
export const apiAuthorizeVotePayload = getApiPayload("authorizeVote");
export const apiAuthorizeVoteError = getApiError("authorizeVote");
export const isApiRequestingAuthorizeVote = getIsApiRequesting("authorizeVote");
export const apiAuthorizeVoteToken = compose(
  get("token"),
  apiAuthorizeVotePayload
);

export const apiStartVoteResponse = getApiResponse("startVote");
export const apiStartVotePayload = getApiPayload("startVote");
export const apiStartVoteError = getApiError("startVote");
export const isApiRequestingStartVote = getIsApiRequesting("startVote");
export const apiStartVoteToken = compose(
  get("token"),
  apiStartVotePayload
);

export const isApiRequestingSetInvoiceStatusByToken = state => token => {
  return (
    setStatusInvoiceIsRequesting(state) &&
    setStatusInvoiceToken(state) === token &&
    setStatusInvoiceStatus(state)
  );
};

export const apiInitError = getApiError("init");
export const apiCensorCommentError = getApiError("censorComment");
export const apiNewUserError = or(apiInitError, getApiError("newUser"));
export const apiUserError = getApiError("user");
export const apiChangePasswordError = or(
  apiInitError,
  getApiError("changePassword")
);
export const apiChangeUsernameError = or(
  apiInitError,
  getApiError("changeUsername")
);
export const apiVerifyNewUserError = or(
  apiInitError,
  getApiError("verifyNewUser")
);
export const apiForgottenPasswordError = or(
  apiInitError,
  getApiError("forgottenPassword")
);
export const apiPasswordResetError = or(
  apiInitError,
  getApiError("passwordReset")
);
export const apiLoginError = or(apiInitError, getApiError("login"));
export const apiLogoutError = getApiError("logout");
export const apiUserSearchError = getApiError("userSearch");
const apiVettedError = getApiError("vetted");
const apiUserInvoicesError = getApiError("userInvoices");
const apiInvoiceError = getApiError("invoice");
const apiNewInvoiceError = getApiError("newInvoice");
const apiSetStatusInvoiceError = getApiError("setStatusInvoice");
const apiCommentsLikesError = getApiError("commentslikes");
export const apiError = or(
  apiInitError,
  apiNewUserError,
  apiChangePasswordError,
  apiChangeUsernameError,
  apiVerifyNewUserError,
  apiCensorCommentError,
  apiLoginError,
  apiLogoutError,
  apiVettedError,
  apiUserInvoicesError,
  apiInvoiceError,
  apiUserSearchError,
  apiNewInvoiceError,
  apiCommentsLikesError,
  apiSetStatusInvoiceError
);

export const csrf = compose(
  get("csrfToken"),
  apiInitResponse
);

export const newUserEmail = compose(
  get("email"),
  apiNewUserPayload
);
export const forgottenPassEmail = compose(
  get("email"),
  apiForgottenPasswordPayload
);
export const emailForResendVerification = compose(
  get("email"),
  apiResendVerificationEmailPayload
);

export const email = or(
  compose(
    get("email"),
    apiMeResponse
  ),
  compose(
    get("email"),
    apiLoginPayload
  )
);

export const loggedInAsEmail = or(
  compose(
    get("email"),
    apiMeResponse
  )
);

export const lastLoginTime = or(
  compose(
    get("lastlogintime"),
    apiMeResponse
  )
);

export const loggedInAsUsername = or(
  compose(
    get("username"),
    apiChangeUsernameResponse
  ),
  compose(
    get("username"),
    apiMeResponse
  )
);

export const isAdmin = bool(
  or(
    compose(
      get("isadmin"),
      apiMeResponse
    ),
    compose(
      get("isadmin"),
      apiLoginResponse
    )
  )
);

export const isTestNet = compose(
  get("testnet"),
  apiInitResponse
);
export const isMainNet = not(isTestNet);

export const userid = state =>
  state.api.me.response && state.api.me.response.userid;
export const censoredComment = state =>
  state.api.censorComment && state.api.censorComment.response;

export const getApiLastLoaded = key => get(["api", "lastLoaded", key]);
export const lastLoadedUserInvoice = getApiLastLoaded("userInvoices");
export const serverPubkey = compose(
  get("pubkey"),
  apiInitResponse
);
export const userPubkey = compose(
  get("publickey"),
  apiMeResponse
);
export const commentsLikes = or(
  compose(
    get("commentslikes"),
    apiCommentsLikesResponse
  ),
  constant(null)
);
export const policy = apiPolicyResponse;
export const isLoadingSubmit = or(
  isApiRequestingPolicy,
  isApiRequestingInit,
  isApiRequestingEditInvoice
);
export const numOfUserInvoices = or(
  compose(
    get("numofinvoices"),
    apiUserInvoicesResponse
  ),
  constant(0)
);
export const apiUserInvoices = or(
  compose(
    get("invoices"),
    apiUserInvoicesResponse
  ),
  constant([])
);
export const userInvoicesIsRequesting = isApiRequestingUserInvoices;
export const userInvoicesError = or(apiInitError, apiUserInvoicesError);
export const apiInvoice = compose(
  get("invoice"),
  apiInvoiceResponse
);
export const invoicePayload = state => state.api.invoice.payload;
export const invoiceToken = compose(
  get(["censorshiprecord", "token"]),
  apiInvoice
);
export const invoiceStatus = compose(
  get("status"),
  apiInvoice
);

export const invoiceAuthor = compose(
  get(["username"]),
  apiInvoice
);
export const invoiceIsRequesting = or(
  isApiRequestingInit,
  isApiRequestingInvoice
);
export const invoiceError = or(apiInitError, apiInvoiceError);
export const user = compose(
  get("user"),
  apiUserResponse
);
export const newUserResponse = bool(apiNewUserResponse);
export const newInvoiceIsRequesting = isApiRequestingNewInvoice;
export const newInvoiceError = apiNewInvoiceError;
export const newInvoiceMerkle = compose(
  get(["censorshiprecord", "merkle"]),
  apiNewInvoiceResponse
);
export const newInvoiceToken = compose(
  get(["censorshiprecord", "token"]),
  apiNewInvoiceResponse
);
export const newInvoiceSignature = compose(
  get(["censorshiprecord", "signature"]),
  apiNewInvoiceResponse
);
export const newInvoiceName = compose(
  get("name"),
  apiNewInvoicePayload
);
export const newInvoiceDescription = compose(
  get("description"),
  apiNewInvoicePayload
);
export const newInvoiceFiles = compose(
  get("files"),
  apiNewInvoicePayload
);
export const setStatusInvoice = compose(
  get("status"),
  apiSetStatusInvoiceResponse
);
export const setStatusInvoiceIsRequesting = isApiRequestingSetStatusInvoice;
export const setStatusInvoiceToken = compose(
  get("token"),
  apiSetStatusInvoicePayload
);
export const setStatusInvoiceStatus = compose(
  get("status"),
  apiSetStatusInvoicePayload
);
export const setStatusInvoiceError = apiSetStatusInvoiceError;
export const verificationToken = compose(
  get("verificationtoken"),
  apiNewUserResponse
);
export const getKeyMismatch = state => state.api.keyMismatch;
export const manageUserAction = compose(
  get("action"),
  apiManageUserPayload
);
export const lastLoginTimeFromLoginResponse = compose(
  get("lastlogintime"),
  apiLoginResponse
);
export const lastLoginTimeFromMeResponse = compose(
  get("lastlogintime"),
  apiMeResponse
);
export const sessionMaxAge = compose(
  get("sessionmaxage"),
  apiMeResponse
);

const apiInvoiceCommentsResponse = getApiResponse("invoiceComments");
export const apiInvoiceComments = or(
  compose(
    get("comments"),
    apiInvoiceCommentsResponse
  ),
  constant([])
);
export const apiEditInvoiceResponse = getApiResponse("editInvoice");
export const apiEditInvoiceError = getApiError("editInvoice");
export const apiEditInvoicePayload = getApiPayload("editInvoice");
export const editInvoiceToken = compose(
  get(["invoice", "censorshiprecord", "token"]),
  apiEditInvoiceResponse
);

export const isApiRequesting = or(
  isApiRequestingInit,
  isApiRequestingUnvettedStatus,
  isApiRequestingPolicy,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  isApiRequestingLogin,
  isApiRequestingLogout,
  isApiRequestingForgottenPassword,
  isApiRequestingResendVerificationEmail,
  isApiRequestingPasswordReset,
  isApiRequestingInviteUser,
  isApiRequestingVetted,
  isApiRequestingUnvetted,
  isApiRequestingUserInvoices,
  isApiRequestingInvoice,
  isApiRequestingNewInvoice,
  isApiRequestingUser,
  isApiRequestingNewComment,
  isApiRequestingSetStatusInvoice,
  isApiRequestingStartVote
);
