/*
This lib is designed to handle persisting data for the text editors using session storage
*/
const qs = require("querystring");

export const NEW_INVOICE_PATH = "/invoices/new";

export const getInvoicePath = location => {
  const { pathname, search } = location;
  const { draftid } = qs.parse(search);
  const path = draftid ? `${pathname}-${draftid}` : pathname;
  return path;
};

export const INVOICE_FORM_NAME = "name";
export const INVOICE_FORM_DESC = "description";

export const getInvoiceBackupKey = (key, path) => `proposal-${key}::${path}`;

const updateFormData = state => {
  const proposalFormState = state.form["form/proposal"];
  const newInvoiceData = (proposalFormState && proposalFormState.values) || {};
  const name = newInvoiceData[INVOICE_FORM_NAME];
  const description = newInvoiceData[INVOICE_FORM_DESC];
  if (!name && !description) {
    return;
  }

  const path = getInvoicePath(window.location);
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_NAME, path),
    newInvoiceData[INVOICE_FORM_NAME]
  );
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_DESC, path),
    newInvoiceData[INVOICE_FORM_DESC]
  );
};

export const resetNewInvoiceData = () => {
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_NAME, NEW_INVOICE_PATH),
    ""
  );
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_DESC, NEW_INVOICE_PATH),
    ""
  );
};

export const getNewInvoiceData = () => {
  return {
    name:
      sessionStorage.getItem(
        getInvoiceBackupKey(INVOICE_FORM_NAME, NEW_INVOICE_PATH)
      ) || "",
    description:
      sessionStorage.getItem(
        getInvoiceBackupKey(INVOICE_FORM_DESC, NEW_INVOICE_PATH)
      ) || ""
  };
};

export const handleSaveTextEditorsContent = state => {
  updateFormData(state);
};
