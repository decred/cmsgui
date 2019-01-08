import * as sel from "../selectors";
import * as api from "../lib/api";
import * as pki from "../lib/pki";
import { confirmWithModal, closeModal } from "./modal";
import * as modalTypes from "../components/Modal/modalTypes";
import * as external_api_actions from "./external_api";
import { clearStateLocalStorage } from "../lib/local_storage";
import { resetNewInvoiceData } from "../lib/editors_content_backup";
import act from "./methods";

export const onInvite = act.REQUEST_INVITE_CONFIRMATION;
export const onInviteConfirm = props => dispatch => {
  dispatch(onInviteNewUser(props));
};

export const onResetInvoice = act.RESET_INVOICE;
export const onSetEmail = act.SET_EMAIL;

export const onSignup = act.REQUEST_SIGNUP_CONFIRMATION;
export const onResetSignup = act.RESET_SIGNUP_CONFIRMATION;
export const onResetRescanUserPayments = act.RESET_RESCAN_USER_PAYMENTS;
export const onSignupConfirm = props => dispatch => {
  dispatch(onCreateNewUser(props));
};

export const requestApiInfo = () => dispatch => {
  dispatch(act.REQUEST_INIT_SESSION());
  return api
    .apiInfo()
    .then(response => {
      dispatch(act.RECEIVE_INIT_SESSION(response));
      dispatch(onRequestMe());
    })
    .catch(error => {
      dispatch(act.RECEIVE_INIT_SESSION(null, error));
    });
};

export const onRequestMe = () => dispatch => {
  dispatch(act.REQUEST_ME());
  return api
    .me()
    .then(response => {
      dispatch(act.RECEIVE_ME(response.user));
    })
    .catch(error => {
      dispatch(act.RECEIVE_ME(null, error));
      clearStateLocalStorage();
    });
};

export const updateMe = payload => dispatch => dispatch(act.UPDATE_ME(payload));

export const cleanErrors = act.CLEAN_ERRORS;

export const onGetPolicy = () => dispatch => {
  dispatch(act.REQUEST_POLICY());
  return api
    .policy()
    .then(response => dispatch(act.RECEIVE_POLICY(response)))
    .catch(error => {
      dispatch(act.RECEIVE_POLICY(null, error));
      throw error;
    });
};

export const withCsrf = fn => (dispatch, getState) => {
  const csrf = sel.csrf(getState());
  const csrfIsNeeded = sel.getCsrfIsNeeded(getState());
  if (csrf || csrfIsNeeded) return fn(dispatch, getState, csrf);

  dispatch(act.CSRF_NEEDED(true));
  return dispatch(requestApiInfo()).then(() =>
    withCsrf(fn)(dispatch, getState)
  );
};

export const onInviteNewUser = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_INVITE_USER({ email }));
    return api
      .inviteNewUser(csrf, email)
      .then(response => {
        dispatch(act.RECEIVE_INVITE_USER(response));
        dispatch(closeModal());
      })
      .catch(error => {
        if (error.toString() === "Error: No available storage method found.") {
          //local storage error
          dispatch(
            act.RECEIVE_INVITE_USER(
              null,
              new Error("CMS requires local storage to work.")
            )
          );
        } else {
          dispatch(act.RECEIVE_INVITE_USER(null, error));
        }
        throw error;
      });
  });

export const onCreateNewUser = ({
  email,
  username,
  password,
  location,
  xpublickey,
  name,
  verificationtoken
}) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_USER({ email }));
    return api
      .newUser(
        csrf,
        email,
        username,
        password,
        name,
        verificationtoken,
        location,
        xpublickey
      )
      .then(response => {
        dispatch(act.RECEIVE_NEW_USER(response));
        dispatch(closeModal());
      })
      .catch(error => {
        if (error.toString() === "Error: No available storage method found.") {
          //local storage error
          dispatch(
            act.RECEIVE_NEW_USER(
              null,
              new Error("CMS requires local storage to work.")
            )
          );
        } else {
          dispatch(act.RECEIVE_NEW_USER(null, error));
        }
        throw error;
      });
  });

export const onResetNewUser = act.RESET_NEW_USER;

export const onVerifyNewUser = searchQuery => dispatch => {
  dispatch(act.REQUEST_VERIFY_NEW_USER(searchQuery));
  return api
    .verifyNewUser(searchQuery)
    .then(res => dispatch(act.RECEIVE_VERIFY_NEW_USER(res)))
    .catch(err => {
      dispatch(act.RECEIVE_VERIFY_NEW_USER(null, err));
      throw err;
    });
};

export const onSearchUser = query => dispatch => {
  dispatch(act.REQUEST_USER_SEARCH());
  return api
    .searchUser(query)
    .then(res => dispatch(act.RECEIVE_USER_SEARCH(res)))
    .catch(err => {
      dispatch(act.RECEIVE_USER_SEARCH(null, err));
      throw err;
    });
};

export const onFetchInvoice = (token, version = null) => dispatch => {
  dispatch(act.REQUEST_INVOICE(token));
  return api
    .invoice(token, version)
    .then(response => {
      response && response.invoice && Object.keys(response.invoice).length > 0
        ? dispatch(act.RECEIVE_INVOICE(response))
        : dispatch(
            act.RECEIVE_INVOICE(
              null,
              new Error("The requested invoice does not exist.")
            )
          );
    })
    .catch(error => {
      dispatch(act.RECEIVE_INVOICE(null, error));
    });
};
export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGIN({ email }));
    return api
      .login(csrf, email, password)
      .then(response => {
        //console.log("login: ", response);
        dispatch(act.RECEIVE_LOGIN(response));
        dispatch(closeModal());
      })
      .then(() => dispatch(onRequestMe()))
      .catch(error => {
        dispatch(act.RECEIVE_LOGIN(null, error));
        throw error;
      });
  });

// handleLogout handles all the procedure to be done once the user is logged out
// it can be called either when the logout request has been successful or when the
// session has already expired
export const handleLogout = response => dispatch => {
  dispatch(act.RECEIVE_LOGOUT(response));
  clearStateLocalStorage();
  external_api_actions.clearPollingPointer();
  dispatch(onSetEmail(""));
};

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGOUT());
    return api
      .logout(csrf)
      .then(response => {
        dispatch(handleLogout(response));
      })
      .catch(error => {
        dispatch(act.RECEIVE_LOGOUT(null, error));
      });
  });

export const onChangeUsername = (password, newUsername) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CHANGE_USERNAME());
    return api
      .changeUsername(csrf, password, newUsername)
      .then(response =>
        dispatch(
          act.RECEIVE_CHANGE_USERNAME({ ...response, username: newUsername })
        )
      )
      .catch(error => {
        dispatch(act.RECEIVE_CHANGE_USERNAME(null, error));
        throw error;
      });
  });

export const onChangePassword = (password, newPassword) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CHANGE_PASSWORD());
    return api
      .changePassword(csrf, password, newPassword)
      .then(response => dispatch(act.RECEIVE_CHANGE_PASSWORD(response)))
      .catch(error => {
        dispatch(act.RECEIVE_CHANGE_PASSWORD(null, error));
        throw error;
      });
  });

export const onFetchUser = userId => dispatch => {
  dispatch(act.RESET_EDIT_USER());
  dispatch(act.REQUEST_USER(userId));
  const regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const valid = regexp.test(userId);
  if (!valid)
    return dispatch(act.RECEIVE_USER(null, "This is not a valid user ID."));
  return api
    .user(userId)
    .then(response => dispatch(act.RECEIVE_USER(response)))
    .catch(error => {
      dispatch(act.RECEIVE_USER(null, error));
    });
};

export const onFetchUserInvoices = (userid, token) => dispatch => {
  dispatch(act.REQUEST_USER_INVOICES());
  return api
    .userInvoices(userid, token)
    .then(response => {
      dispatch(act.RECEIVE_USER_INVOICES(response));
    })
    .catch(error => {
      dispatch(act.RECEIVE_USER_INVOICES(null, error));
    });
};

export const onEditUser = preferences =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_EDIT_USER(preferences));
    return api
      .editUser(csrf, preferences)
      .then(response => dispatch(act.RECEIVE_EDIT_USER(response)))
      .catch(error => {
        dispatch(act.RECEIVE_EDIT_USER(null, error));
      });
  });

export const onManageUser = (userId, action) =>
  withCsrf((dispatch, getState, csrf) => {
    return dispatch(
      confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {})
    ).then(({ confirm, reason }) => {
      if (confirm) {
        dispatch(act.REQUEST_MANAGE_USER({ userId, action, reason }));
        return api
          .manageUser(csrf, userId, action, reason)
          .then(response => dispatch(act.RECEIVE_MANAGE_USER(response)))
          .catch(error => {
            dispatch(act.RECEIVE_MANAGE_USER(null, error));
          });
      }
    });
  });

export const onSubmitInvoice = (
  loggedInAsEmail,
  userid,
  month,
  year,
  csv,
  publickey,
  signature
) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_NEW_INVOICE({
        userid,
        month,
        year,
        csv,
        publickey,
        signature
      })
    );
    return Promise.resolve(api.makeInvoice(userid, month, year, csv))
      .then(invoice => api.signInvoice(loggedInAsEmail, invoice))
      .then(invoice => api.newInvoice(csrf, invoice))
      .then(invoice => {
        dispatch(
          act.RECEIVE_NEW_INVOICE({
            ...invoice,
            userid
          })
        );
        resetNewInvoiceData();
      })
      .catch(error => {
        dispatch(act.RECEIVE_NEW_INVOICE(null, error));
        resetNewInvoiceData();
        throw error;
      });
  });

export const onSubmitEditedInvoice = (
  loggedInAsEmail,
  userid,
  month,
  year,
  file,
  publickey,
  signature,
  token
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(
      act.REQUEST_EDIT_INVOICE({
        userid,
        month,
        year,
        file,
        publickey,
        signature
      })
    );
    return Promise.resolve(
      api.makeInvoice(userid, month, year, file, publickey, signature)
    )
      .then(invoice => api.signInvoice(loggedInAsEmail, invoice))
      .then(invoice => api.editInvoice(csrf, { ...invoice, token }))
      .then(invoice => {
        dispatch(act.RECEIVE_EDIT_INVOICE(invoice));
        resetNewInvoiceData();
      })
      .catch(error => {
        dispatch(act.RECEIVE_EDIT_INVOICE(null, error));
        resetNewInvoiceData();
        throw error;
      });
  });

export const onUpdateUserKey = loggedInAsEmail =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_UPDATED_KEY());
    return pki
      .generateKeys()
      .then(keys =>
        api.updateKeyRequest(csrf, pki.toHex(keys.publicKey)).then(response => {
          const { verificationtoken } = response;
          if (verificationtoken) {
            const { testnet } = getState().api.init.response;
            if (testnet) {
              dispatch(act.SHOULD_AUTO_VERIFY_KEY(true));
            }
          }
          return pki
            .loadKeys(loggedInAsEmail, keys)
            .then(() =>
              dispatch(act.RECEIVE_UPDATED_KEY({ ...response, success: true }))
            );
          // return dispatch(act.RECEIVE_UPDATED_KEY({ ...response, success: true }));
        })
      )
      .catch(error => {
        dispatch(act.RECEIVE_UPDATED_KEY(null, error));
        throw error;
      });
  });

export const redirectedFrom = location => dispatch =>
  dispatch(act.REDIRECTED_FROM(location));
export const resetRedirectedFrom = () => dispatch =>
  dispatch(act.RESET_REDIRECTED_FROM());

export const onForgottenPasswordRequest = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_FORGOTTEN_PASSWORD_REQUEST({ email }));
    return api
      .forgottenPasswordRequest(csrf, email)
      .then(response =>
        dispatch(act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST(response))
      )
      .catch(error => {
        dispatch(act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST(null, error));
        throw error;
      });
  });

export const resetForgottenPassword = () => dispatch =>
  dispatch(act.RESET_FORGOTTEN_PASSWORD_REQUEST());

export const resetResendVerificationEmail = () => dispatch =>
  dispatch(act.RESET_RESEND_VERIFICATION_EMAIL());

export const onPasswordResetRequest = ({
  email,
  verificationtoken,
  newpassword
}) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_PASSWORD_RESET_REQUEST({
        email,
        verificationtoken,
        newpassword
      })
    );
    return api
      .passwordResetRequest(csrf, email, verificationtoken, newpassword)
      .then(response => dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(response)))
      .catch(error => {
        dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(null, error));
        throw error;
      });
  });

export const keyMismatch = payload => dispatch =>
  dispatch(act.KEY_MISMATCH(payload));

export const resetPasswordReset = () => dispatch =>
  dispatch(act.RESET_PASSWORD_RESET_REQUEST());
