import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import {
  LIST_HEADER_USER,
  INVOICE_USER_FILTER_SUBMITTED,
  INVOICE_USER_FILTER_DRAFT
} from "../constants";

const userInvoicesConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    error: sel.userInvoicesError,
    isLoading: or(sel.userInvoicesIsRequesting),
    invoices: sel.getUserInvoices,
    invoiceCounts: sel.getUserInvoiceFilterCounts,
    filterValue: sel.getUserFilterValue,
    lastLoadedInvoice: sel.lastLoadedUserInvoice,
    header: () => LIST_HEADER_USER,
    emptyInvoicesMessage: () => "You have not created any invoices yet"
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchUserInvoices: act.onFetchUserInvoices,
        onChangeFilter: act.onChangeUserFilter
      },
      dispatch
    )
);

class Wrapper extends Component {
  componentDidMount() {
    const { match, onChangeFilter, userid } = this.props;

    if (match.params && typeof match.params.filter !== "undefined") {
      onChangeFilter(
        {
          submitted: INVOICE_USER_FILTER_SUBMITTED,
          drafts: INVOICE_USER_FILTER_DRAFT
        }[match.params.filter]
      );
    }

    if (userid) {
      this.props.onFetchUserInvoices(userid);
    }
  }

  componentDidUpdate(prevProps) {
    const { userid } = this.props;
    const userFetched = !prevProps.userid && this.props.userid;
    if (userFetched) this.props.onFetchUserInvoices(userid);
  }

  render() {
    const { Component, ...props } = this.props;
    return (
      <div className="page content user-proposals-page">
        <Component {...{ ...props }} />
      </div>
    );
  }
}

const wrap = Component =>
  userInvoicesConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
