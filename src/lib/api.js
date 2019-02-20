import "isomorphic-fetch";
import CryptoJS from "crypto-js";
import * as pki from "./pki";
import { sha3_256 } from "js-sha3";
import get from "lodash/fp/get";
import MerkleTree from "./merkle";
import {
  getHumanReadableError,
  base64ToArrayBuffer,
  arrayBufferToWordArray,
  utoa
} from "../helpers";
import { NEW_INVOICE } from "../actions/types";

export const TOP_LEVEL_COMMENT_PARENTID = "0";

const STATUS_ERR = {
  400: "Bad response from server",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not found"
};

const qs = require("querystring");
const apiBase = "/api";
const getUrl = (path, version = "v1") => `${apiBase}/${version}${path}`;
const getResponse = get("response");

export const digestPayload = payload =>
  CryptoJS.SHA256(
    arrayBufferToWordArray(base64ToArrayBuffer(payload))
  ).toString(CryptoJS.enc.Hex);

export const digest = payload => sha3_256(payload);

export const convertCSVToFile = csv => ({
  name: "invoice.csv",
  mime: "text/csv; charset=utf-8",
  payload: utoa(csv)
});

export const invoice = (token = null) =>
  GET("/v1/invoice?" + qs.stringify({ token })).then(getResponse);

export const makeInvoice = (userid, month, year, csv, attachments = []) => ({
  file: [
    convertCSVToFile(userid + ": " + month + "/" + year + "/n" + csv),
    ...(attachments || [])
  ].map(({ name, mime, payload }) => ({
    name,
    mime,
    payload,
    digest: digestPayload(payload)
  })),
  month: parseInt(month),
  year: parseInt(year)
});

export const makeComment = (token, comment, parentid) => ({
  token,
  parentid: parentid || TOP_LEVEL_COMMENT_PARENTID,
  comment
});

export const makeLikeComment = (token, action, commentid) => ({
  token,
  commentid,
  action
});

export const makeCensoredComment = (token, reason, commentid) => ({
  token,
  commentid,
  reason
});

export const signInvoice = (email, invoice) =>
  pki.myPubKeyHex(email).then(publickey => {
    const digests = invoice.file
      .map(x => Buffer.from(get("digest", x), "hex"))
      .sort(Buffer.compare);
    const tree = new MerkleTree(digests);
    const root = tree.getRoot().toString("hex");
    invoice.file = invoice.file[0];
    return pki
      .signStringHex(email, root)
      .then(signature => ({ ...invoice, publickey, signature }));
  });

export const signComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.parentid, comment.comment].join("")
        )
        .then(signature => ({ ...comment, publickey, signature }))
    );

export const signLikeComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.commentid, comment.action].join("")
        )
        .then(signature => ({ ...comment, publickey, signature }))
    );

export const signCensorComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.commentid, comment.reason].join("")
        )
        .then(signature => ({ ...comment, publickey, signature }))
    );

const parseResponseBody = response => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json"))
    return response.json();
  const err = new Error(STATUS_ERR[response.status] || "Internal server error");
  err.internalError = true;
  err.statusCode = response.status;
  throw err;
};

export const parseResponse = response =>
  parseResponseBody(response).then(json => {
    if (json.errorcode) {
      const err = new Error(
        getHumanReadableError(json.errorcode, json.errorcontext)
      );
      err.internalError = false;
      err.errorCode = json.errorcode;
      err.errorContext = json.errorcontext;
      throw err;
    }
    return { response: json, csrfToken: response.headers.get("X-Csrf-Token") };
  });

const GET = path =>
  fetch(apiBase + path, { credentials: "include" }).then(parseResponse);

const getOptions = (csrf, json, method) => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Csrf-Token": csrf
  },
  credentials: "include", // Include cookies
  method,
  body: JSON.stringify(json)
});

const POST = (path, csrf, json) =>
  fetch(getUrl(path), getOptions(csrf, json, "POST")).then(parseResponse);

export const me = () => GET("/").then(getResponse);

export const apiInfo = () =>
  GET("/").then(
    ({ csrfToken, response: { version, route, pubkey, testnet } }) => ({
      csrfToken: csrfToken,
      version,
      route,
      pubkey,
      testnet
    })
  );

export const inviteNewUser = (csrf, email) =>
  POST("/user/invite", csrf, {
    email
  }).then(getResponse);

export const newUser = (
  csrf,
  email,
  username,
  password,
  name,
  verificationtoken,
  location,
  xpublickey
) =>
  pki.signStringHex(email, verificationtoken).then(signature => {
    pki.myPubKeyHex(email).then(publickey =>
      POST("/user/new", csrf, {
        email,
        verificationtoken,
        username,
        password: digest(password),
        name,
        publickey,
        location,
        xpublickey,
        signature
      }).then(getResponse)
    );
  });

export const verifyNewUser = searchQuery => {
  const { email, verificationtoken } = qs.parse(searchQuery);
  return pki
    .signStringHex(email, verificationtoken)
    .then(signature =>
      GET(
        "/v1/user/identity/verify?" +
          qs.stringify({ email, verificationtoken, signature })
      )
    )
    .then(getResponse);
};

export const editUser = (csrf, { emailnotifications }) =>
  POST("/user/edit", csrf, {
    emailnotifications
  }).then(getResponse);
//	RouteEditUserExtendedPublicKey = "/user/edit/xpublickey"
export const manageUser = (csrf, userid, action, reason) =>
  POST("/user/manage", csrf, { userid, action, reason }).then(getResponse);

export const login = (csrf, email, password) =>
  POST("/login", csrf, { email, password: digest(password) }).then(getResponse);

export const changeUsername = (csrf, password, newusername) =>
  POST("/user/username/change", csrf, {
    password: digest(password),
    newusername
  }).then(getResponse);

export const changePassword = (csrf, currentpassword, newpassword) =>
  POST("/user/password/change", csrf, {
    currentpassword: digest(currentpassword),
    newpassword: digest(newpassword)
  }).then(getResponse);

export const forgottenPasswordRequest = (csrf, email) =>
  POST("/user/password/reset", csrf, { email }).then(getResponse);

export const passwordResetRequest = (
  csrf,
  email,
  verificationtoken,
  newpassword
) =>
  POST("/user/password/reset", csrf, {
    email,
    verificationtoken,
    newpassword: digest(newpassword)
  }).then(getResponse);

export const updateKeyRequest = (csrf, publickey) =>
  POST("/user/key", csrf, { publickey }).then(getResponse);

export const verifyKeyRequest = (csrf, email, verificationtoken) =>
  pki
    .signStringHex(email, verificationtoken)
    .then(signature =>
      POST("/user/key/verify", csrf, { signature, verificationtoken }).then(
        getResponse
      )
    );

export const policy = () => GET("/v1/policy").then(getResponse);

export const searchUser = obj =>
  GET(`/v1/users?${qs.stringify(obj)}`).then(getResponse);

export const user = userId => GET(`/v1/user/${userId}`).then(getResponse);
export const logout = csrf =>
  POST("/logout", csrf, {}).then(() => {
    localStorage.removeItem("state");
    return {};
  });

export const userInvoices = (status, page) =>
  GET(`/v1/user/invoices?${qs.stringify(status)}&${qs.stringify(page)}`).then(
    getResponse
  );

export const invoices = (csrf, status, month, year, page) =>
  POST("/v1/invoices", csrf, {
    status,
    month,
    year,
    page
  }).then(getResponse);

export const reviewInvoices = (csrf, month, year) =>
  POST("/v1/invoices/review", csrf, {
    month,
    year
  }).then(getResponse);

export const payInvoices = (csrf, month, year, dcrusdrate) =>
  POST("/v1/invoices/pay", csrf, {
    month,
    year,
    dcrusdrate
  }).then(getResponse);

export const newInvoice = (csrf, invoice) =>
  POST("/invoice/submit", csrf, invoice).then(
    ({ response: { censorshiprecord } }) => ({
      ...invoice,
      censorshiprecord,
      timestamp: Date.now() / 1000,
      status: NEW_INVOICE
    })
  );

export const editInvoice = (csrf, token, file, publickey, signature) =>
  POST("/v1/invoice/edit", csrf, {
    token,
    file,
    publickey,
    signature
  }).then(getResponse);

export const invoiceDetails = (csrf, token) =>
  POST("/v1/invoice", csrf, {
    token
  }).then(getResponse);

export const setInvoiceStatus = (csrf, token, status) =>
  POST("/v1/invoice/status", csrf, {
    token,
    status
  }).then(getResponse);

export const updateInvoicePayment = (csrf, token, address, amount, txid) =>
  POST("/v1/invoice/payments/update", csrf, {
    token,
    address,
    amount,
    txid
  }).then(getResponse);
