import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const actions = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    email: sel.email,
    userid: sel.userid,
    isAdmin: sel.isAdmin,
    setStatusInvoiceToken: sel.setStatusInvoiceToken,
    setStatusInvoiceError: sel.setStatusInvoiceError,
    authorizeVoteError: sel.apiAuthorizeVoteError,
    authorizeVoteToken: sel.apiAuthorizeVoteToken,
    isApiRequestingSetInvoiceStatusByToken:
      sel.isApiRequestingSetInvoiceStatusByToken,
    startVoteError: sel.apiStartVoteError
  }),
  {
    openModal: act.openModal
  }
);

export default actions;
