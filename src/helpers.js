import get from "lodash/fp/get";
import CryptoJS from "crypto-js";
import * as pki from "./lib/pki";
import { INVALID_FILE } from "./constants";

export const getProposalStatus = proposalStatus =>
  get(proposalStatus, [
    "Invalid",
    "Not found",
    "Not reviewed",
    "Censored",
    "Public",
    "Unreviewed changes",
    "Abandoned",
    "Rejected",
    "Approved"
  ]);

export const utoa = str => window.btoa(unescape(encodeURIComponent(str)));
export const atou = str => decodeURIComponent(escape(window.atob(str)));

// This function extracts the content of index.md's payload. The payload is
// formatted as:
//
//  <proposal name>\n
//  <proposal description>
//
export const getTextFromIndexMd = file => {
  const text = atou(file.payload);
  return text.substring(text.indexOf("\n") + 1);
};

export const getHumanReadableError = errorCode => {
  const genericContactMsg = "Please contact CMS administrators";
  const errorMessages = {
    0: "The operation returned an invalid status.",
    1: "The provided email address or password was invalid.",
    2: "The provided email address is malformed.",
    3: "The provided verification token is invalid. Please ensure you click the link or copy and paste it exactly as it appears in the verification email.",
    4: "The provided verification token is expired. Please register again to receive another email with a new verification token.",
    5: "The provided verification token is not yet expired.",
    6: "The invoice is not found.",
    7: "The provided password was malformed.",
    8: "The file digest was invalid.",
    9: "The base64 file content was invalid.",
    10: "There was an invalid MIME type detected for the file.",
    11: "There was an unsupported MIME type detected for the file.",
    12: "There is an invalid invoice status",
    13: "The public key is invalid.",
    14: "The given public key has already been submitted.",
    15: "There is no active public key",
    16: "The signature is invalid.",
    17: "The input was invalid.",
    18: "The signing key was invalid.",
    19: "User was not found.",
    20: "User is not logged in.",
    21: "The given username is malformed.",
    22: "The given username is already taken.",
    23: `Account locked due to too many login attempts. ${genericContactMsg}.`,
    24: "Invalid user manage action.",
    25: "User already exists.",
    26: "Reason for action not provided.",
    27: "Malformed invoice file.",
    28: "Invoice payment not found.",
    29: "Duplicate invoice for this month and year."
  };

  const error = errorMessages[errorCode];
  if (!error) {
    // If the error code sent from the server cannot be translated to any error message,
    // it's an internal error code for an internal server error.
    return (
      "The server encountered an unexpected error, please contact CMS " +
      "administrators and include the following error code: " +
      errorCode
    );
  }

  return error;
};

// Copied from https://stackoverflow.com/a/43131635
export const hexToArray = hex =>
  new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = base64 => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = ab => {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    // eslint-disable-next-line
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
};

export const getUsernameFieldLabel = (policy, defaultText = "Username") => {
  if (policy) {
    return `${defaultText} (${policy.minusernamelength} - ${
      policy.maxusernamelength
    } characters)`;
  }
  return defaultText;
};

export const getPasswordFieldLabel = (policy, defaultText = "Password") => {
  if (policy) {
    return `${defaultText} (at least ${policy.minpasswordlength} characters)`;
  }
  return defaultText;
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#3F";
  for (let i = 0; i < 4; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const uniqueID = prefix =>
  prefix +
  "_" +
  Math.random()
    .toString(36)
    .substr(2, 9);

export const verifyUserPubkey = (email, keyToBeMatched, keyMismatchAction) =>
  pki
    .getKeys(email)
    .then(keys => keyMismatchAction(keys.publicKey !== keyToBeMatched));

export const multiplyFloatingNumbers = (num1, num2) => {
  let cont1 = 0;
  let cont2 = 0;
  while (num1 < 1) {
    num1 *= 10;
    cont1++;
  }
  while (num2 < 1) {
    num2 *= 10;
    cont2++;
  }
  return (num1 * num2) / Math.pow(10, cont1 + cont2);
};

export const isProposalApproved = vs => {
  const hasReachedQuorom =
    vs.totalvotes >= (vs.numofeligiblevotes * vs.quorumpercentage) / 100;
  const yesOption = vs.optionsresult && vs.optionsresult[1];
  const hasPassed =
    yesOption &&
    vs.totalvotes > 0 &&
    yesOption.votesreceived >= (vs.totalvotes * vs.passpercentage) / 100;
  return hasReachedQuorom && hasPassed;
};

export const proposalsArrayToObject = arr =>
  arr
    ? arr.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.censorshiprecord.token]: cur
        };
      }, {})
    : {};

export const removeProposalsDuplicates = (arr1, arr2) => {
  const mergedObj = {
    ...proposalsArrayToObject(arr1),
    ...proposalsArrayToObject(arr2)
  };
  return Object.keys(mergedObj).map(item => mergedObj[item]);
};

export const exportToCsv = (data, fields) => {
  const csvContent = data.reduce((acc, info) => {
    let row = "";
    fields.forEach(f => (row += `"${info[f]}",`));
    return acc + row + "\n";
  }, "");
  const titles = fields.reduce((acc, f) => acc + `"${f}",`, "");
  const csv = "data:text/csv;charset=utf-8," + titles + "\n" + csvContent;
  const content = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", content);
  link.setAttribute("download", "payment_history");
  link.click();
};

export const formatDate = date => {
  const twoChars = v => (v < 10 ? `0${v}` : v);
  const d = new Date(date * 1000);
  const year = d.getUTCFullYear();
  const month = twoChars(d.getUTCMonth());
  const day = twoChars(d.getUTCDate());
  const hours = twoChars(d.getUTCHours());
  const minutes = twoChars(d.getUTCMinutes());
  const seconds = twoChars(d.getUTCSeconds());
  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
};

export const setQueryStringWithoutPageReload = qs => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qs;
  window.history.pushState({ path: newurl }, "", newurl);
};

export const getJsonData = base64 => {
  const data = atob(base64.split(",").pop());
  try {
    const json = JSON.parse(data);
    if (!json) throw new Error(INVALID_FILE);
    return json;
  } catch (e) {
    throw new Error(INVALID_FILE);
  }
};
