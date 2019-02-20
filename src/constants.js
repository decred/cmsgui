export const MAINNET = "mainnet";
export const TESTNET = "testnet";

export const EXPLORER = "explorer";

export const INVOICE_FILTER_ALL = 0;

export const INVOICE_USER_FILTER_SUBMITTED = 1;
export const INVOICE_USER_FILTER_DRAFT = 2;

export const PAYWALL_STATUS_WAITING = 0;
export const PAYWALL_STATUS_LACKING_CONFIRMATIONS = 1;
export const PAYWALL_STATUS_PAID = 2;
export const CONFIRMATIONS_REQUIRED = 2;

export const PUB_KEY_STATUS_LOADING = 0;
export const PUB_KEY_STATUS_LOADED = 1;

export const USER_DETAIL_TAB_GENERAL = 0;
export const USER_DETAIL_TAB_PREFERENCES = 1;
export const USER_DETAIL_TAB_INVOICES = 2;
export const USER_DETAIL_TAB_COMMENTS = 3;

export const MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION = 1;
export const MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION = 2;
export const MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION = 3;
export const MANAGE_USER_CLEAR_USER_PAYWALL = 4;
export const MANAGE_USER_UNLOCK = 5;
export const MANAGE_USER_DEACTIVATE = 6;
export const MANAGE_USER_REACTIVATE = 7;

export const LIST_HEADER_PUBLIC = "Public Invoices";
export const LIST_HEADER_UNVETTED = "Unvetted Invoices";
export const LIST_HEADER_USER = "Your Invoices";

export const SORT_BY_OLD = "OLD";
export const SORT_BY_NEW = "NEW";
export const SORT_BY_TOP = "TOP";

export const DEFAULT_TAB_TITLE = "Contractor Management System";

// Import key errors
export const PUBLIC_KEY_MISMATCH =
  "The provided public key doesn't match the key stored in the server.";
export const INVALID_KEY_PAIR = "The provided key pair is not valid.";
export const INVALID_FILE =
  "This is not a valid identity file. The identity has to be a JSON file containing the publicKey and the secretKey values.";
export const LOAD_KEY_FAILED =
  "Sorry, something went wrong while importing the identity file, please try again. If the error persists, contact the CMS support.";

export const INVOICE_STATUS_INVALID = 0; // Invalid status
export const INVOICE_STATUS_NOTFOUND = 1; // Invoice not found
export const INVOICE_STATUS_NOTREVIEWED = 2; // Invoice has not been reviewed
export const INVOICE_STATUS_UNREVIEWEDCHANGES = 3; // Invoice has unreviewed changes
export const INVOICE_STATUS_REJECTED = 4; // Invoice needs to be revised
export const INVOICE_STATUS_APPROVED = 5; // Invoice has been approved
export const INVOICE_STATUS_PAID = 6; // Invoice has been paid
