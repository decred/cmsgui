import { SubmissionError } from "redux-form";
import { emailValidator, isRequiredValidator } from "./util";

const validate = (policy, values) => {
  if (!isRequiredValidator(values.email)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }
  if (!emailValidator(values.email)) {
    throw new SubmissionError({ _error: "Invalid email address" });
  }
};

export default validate;
