import { SubmissionError } from "redux-form";
import { isFileValid } from "../components/ProposalImages/helpers";
import { isRequiredValidator } from "./util";

function checkInvoiceMonth(props, values) {
  const month = parseInt(values.month.trim());
  return !month || month < 1 || month > 12;
}

function checkInvoiceYear(props, values) {
  const year = parseInt(values.year.trim());
  return !year || year < 2018 || year > 2020;
}

function checkInvoiceFormatting() {
  return false;
}

const validate = (values, dispatch, props) => {
  if (
    !isRequiredValidator(values.month && values.month.trim()) ||
    !isRequiredValidator(values.year && values.year.trim()) ||
    !isRequiredValidator(values.csv && values.csv.trim())
  ) {
    throw new SubmissionError({
      _error: "You must provide both an invoice month and year."
    });
  }

  if (checkInvoiceMonth(props, values)) {
    throw new SubmissionError({
      _error:
        "The invoice month be between 3 and 9 characters long and only contain: a-z, A-Z"
    });
  }
  if (checkInvoiceYear(props, values)) {
    throw new SubmissionError({
      _error:
        "The invoice year be a valid number greater than 2017 and less than 2020"
    });
  }
  //validateURL(values.description);

  if (values.files) {
    if (values.files.length > props.policy.maximages) {
      throw new SubmissionError({
        _error: `Only ${props.policy.maximages} attachments are allowed.`
      });
    }

    const errors = values.files.reduce((acc, file) => {
      const fileValidation = isFileValid(file, props.policy);
      if (!fileValidation.valid) {
        return [...acc, fileValidation.errorMsg];
      }
      return acc;
    }, []);

    if (errors && errors.length > 0) {
      throw new SubmissionError({
        _error: errors.length > 1 ? errors : errors[0]
      });
    }
  }
  if (props.keyMismatch) {
    throw new SubmissionError({
      _error:
        "Your local key does not match the one on the server.  Please generate a new one under account settings."
    });
  }
};

const synchronousValidation = (values, props) => {
  const errors = {};
  errors._error = "Errors found";
  if (!isRequiredValidator(values.month && values.month.trim())) {
    errors.month = "You must provide an invoice month.";
  } else if (checkInvoiceMonth(props, values)) {
    errors.month =
      "The invoice month must be between 3 and 10 characters long and only contain the following characters: a-z A-Z.";
  }
  if (!isRequiredValidator(values.year && values.year.trim())) {
    errors.year = "You must provide an invoice month.";
  } else if (checkInvoiceYear(props, values)) {
    errors.year =
      "The invoice year be a valid number greater than 2017 and less than 2020";
  } else if (!isRequiredValidator(values.csv && values.csv.trim())) {
    errors.csv = "You must provide a csv.";
  } else if (checkInvoiceFormatting(props, values)) {
    errors.csv = "You have provided an incorrectly formatted invoice CSV.";
  } else {
    errors._error = null;
  }
  return errors;
};

const warn = (values, props) => {
  const warnings = {};
  if (props.policy) {
    /*
    const nameLengthLimit = props.policy.maxproposalnamelength - 10;
    if (values.name && values.name.trim().length > nameLengthLimit) {
      warnings.name = `The proposal name is close to the limit of ${
        props.policy.maxproposalnamelength
      } characters. Current Length: ${values.name.length}.`;
    }
    */
  }
  return warnings;
};

export { validate, synchronousValidation, warn };
