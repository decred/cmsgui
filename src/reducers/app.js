import * as act from "../actions/types";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";
import { uniqueID } from "../helpers";

export const DEFAULT_STATE = {
  isShowingSignupConfirmation: false,
  replyParent: TOP_LEVEL_COMMENT_PARENTID,
  newProposal: {
    name: "",
    description: ""
  },
  replyThreadTree: {},
  proposalCredits: 0,
  recentPayments: [],
  submittedInvoices: {},
  draftInvoices: null,
  identityImportResult: { errorMsg: "", successMsg: "" },
  onboardViewed: false,
  pollingCreditsPayment: false,
  redirectedFrom: null
};

const app = (state = DEFAULT_STATE, action) =>
  (({
    [act.SET_REPLY_PARENT]: () => ({
      ...state,
      replyParent: action.payload || TOP_LEVEL_COMMENT_PARENTID
    }),
    [act.RECEIVE_NEW_INVOICE]: () =>
      action.error
        ? state
        : {
            ...state,
            submittedInvoices: {
              ...state.submittedInvoices,
              lastSubmitted: action.payload.censorshiprecord.token,
              [action.payload.censorshiprecord.token]: action.payload
            }
          },
    [act.SAVE_DRAFT_INVOICE]: () => {
      const newDraftInvoices = state.draftInvoices;
      const draftId = action.payload.draftId || uniqueID("draft");
      return {
        ...state,
        draftInvoices: {
          ...newDraftInvoices,
          newDraft: true,
          lastSubmitted: action.payload.name,
          [draftId]: {
            ...action.payload,
            draftId
          }
        }
      };
    },
    [act.DELETE_DRAFT_INVOICE]: () => {
      const draftId = action.payload;
      if (!state.draftInvoices[draftId]) {
        return state;
      }
      const newDraftInvoices = state.draftInvoices;
      delete newDraftInvoices[draftId];
      return { ...state, draftInvoices: newDraftInvoices };
    },
    [act.LOAD_DRAFT_INVOICES]: () => ({
      ...state,
      draftInvoices: action.payload
    }),
    [act.RESET_LAST_SUBMITTED]: () => ({
      ...state,
      submittedInvoices: { ...state.submittedInvoices, lastSubmitted: false }
    }),
    [act.REQUEST_INVITE_CONFIRMATION]: () => ({
      ...state,
      isShowingInviteConfirmation: true
    }),
    [act.RESET_INVITE_CONFIRMATION]: () => ({
      ...state,
      isShowingInviteConfirmation: false
    }),
    [act.REQUEST_SIGNUP_CONFIRMATION]: () => ({
      ...state,
      isShowingSignupConfirmation: true
    }),
    [act.RESET_SIGNUP_CONFIRMATION]: () => ({
      ...state,
      isShowingSignupConfirmation: false
    }),
    [act.CHANGE_ADMIN_FILTER_VALUE]: () => ({
      ...state,
      adminInvoicesShow: action.payload
    }),
    [act.CHANGE_PUBLIC_FILTER_VALUE]: () => ({
      ...state,
      publicInvoicesShow: action.payload
    }),
    [act.CHANGE_USER_FILTER_VALUE]: () => ({
      ...state,
      userInvoicesShow: action.payload
    }),
    [act.LOAD_ME]: () => {
      const proposalCredits = action.payload.response.proposalcredits;
      return {
        ...state,
        proposalCredits: proposalCredits || state.proposalCredits
      };
    },
    [act.CSRF_NEEDED]: () => ({ ...state, csrfIsNeeded: action.payload }),
    [act.SHOULD_AUTO_VERIFY_KEY]: () => ({
      ...state,
      shouldVerifyKey: action.payload
    }),
    [act.IDENTITY_IMPORTED]: () => ({
      ...state,
      identityImportResult: action.payload
    }),
    [act.SET_ONBOARD_AS_VIEWED]: () => ({ ...state, onboardViewed: true }),
    [act.REDIRECTED_FROM]: () => ({ ...state, redirectedFrom: action.payload }),
    [act.RESET_REDIRECTED_FROM]: () => ({ ...state, redirectedFrom: null })
  }[action.type] || (() => state))());

export default app;
