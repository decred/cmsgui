import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import orderBy from "lodash/fp/orderBy";
import { or, constant, not } from "../lib/fp";
import {
  apiInvoice,
  apiUserInvoices,
  numOfUserInvoices,
  userid,
  getKeyMismatch,
  apiInvoiceComments
} from "./api";
import {
  INVOICE_FILTER_ALL,
  INVOICE_USER_FILTER_DRAFT,
  INVOICE_USER_FILTER_SUBMITTED
} from "../constants";
import { getTextFromIndexMd } from "../helpers";

const qs = require("querystring");

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const invoice = state => {
  const invoice = apiInvoice(state) || {};

  return invoice;
};

export const proposalCredits = state => state.app.proposalCredits;

export const getLastSubmittedProposal = state =>
  state.app.submittedProposals.lastSubmitted;
export const newInvoiceInitialValues = state =>
  state.app.draftInvoices.initialValues || {};
export const draftInvoices = state =>
  state && state.app && state.app.draftInvoices;
export const draftInvoiceById = state => {
  const drafts = draftInvoices(state);
  const { draftid } = qs.parse(window.location.search);
  return (draftid && drafts && drafts[draftid]) || false;
};
export const getUserAlreadyPaid = state => state.app.userAlreadyPaid;
export const getAdminFilterValue = state =>
  parseInt(state.app.adminProposalsShow, 10);
export const getPublicFilterValue = state =>
  parseInt(state.app.publicProposalsShow, 10);
export const getUserFilterValue = state =>
  parseInt(state.app.userProposalsShow, 10);
export const isMarkdown = compose(
  eq("index.md"),
  get("name")
);
export const getProposalFiles = compose(
  get("files"),
  invoice
);
export const getMarkdownFile = compose(
  find(isMarkdown),
  getProposalFiles
);
export const getNotMarkdownFile = compose(
  filter(not(isMarkdown)),
  getProposalFiles
);

export const getEditInvoiceValues = state => {
  const { name } = invoice(state);

  const files = name ? getNotMarkdownFile(state) : [];
  const description = name ? getTextFromIndexMd(getMarkdownFile(state)) : "";
  return {
    name,
    description,
    files
  };
};

export const getTempThreadTree = state => state.app.replyThreadTree;

export const getDraftInvoices = state => {
  const draftsObj = draftInvoices(state) || {};
  const drafts = Object.keys(draftsObj)
    .filter(
      key => ["newDraft", "lastSubmitted", "originalName"].indexOf(key) === -1
    )
    .map(key => draftsObj[key]);
  return drafts;
};

export const invoices = state => {
  const invoices = apiUserInvoices(state);
  return invoices;
};
export const draftProposals = state =>
  state && state.app && state.app.draftProposals;

export const getSubmittedUserInvoices = state => userID => {
  const isUserProp = prop => prop.userid === userID;
  const userInvoices = invoices(state).filter(isUserProp);
  const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);
  return sortByNewestFirst(userInvoices);
};

export const invoiceComments = state => apiInvoiceComments(state);
export const getUserInvoices = state => {
  const userID = userid(state);
  return getSubmittedUserInvoices(state)(userID);
};

export const userCanExecuteActions = state => {
  return !getKeyMismatch(state);
};
export const getUserInvoiceFilterCounts = state => {
  const proposalFilterCounts = {
    [INVOICE_USER_FILTER_SUBMITTED]: numOfUserInvoices(state),
    [INVOICE_USER_FILTER_DRAFT]: getDraftInvoices(state).length
  };

  proposalFilterCounts[INVOICE_FILTER_ALL] = Object.keys(
    proposalFilterCounts
  ).reduce((total, filterValue) => total + proposalFilterCounts[filterValue]);

  return proposalFilterCounts;
};

export const getCsrfIsNeeded = state =>
  state.app ? state.app.csrfIsNeeded : null;

export const isShowingSignupConfirmation = state =>
  state.app.isShowingSignupConfirmation;

export const shouldAutoVerifyKey = state => state.app.shouldVerifyKey;

export const identityImportError = state =>
  state.app.identityImportResult && state.app.identityImportResult.errorMsg;

export const identityImportSuccess = state =>
  state.app.identityImportResult && state.app.identityImportResult.successMsg;

export const onboardViewed = state => state.app.onboardViewed;

export const commentsSortOption = state => state.app.commentsSortOption;

export const redirectedFrom = state => state.app.redirectedFrom;
