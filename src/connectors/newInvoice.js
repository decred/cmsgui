import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { or } from "../lib/fp";
import { validate } from "../validators/invoice";
import { getNewInvoiceData } from "../lib/editors_content_backup";

const newInvoiceConnector = connect(
  sel.selectorMap({
    draftInvoice: sel.draftInvoiceById,
    isLoading: or(sel.isLoadingSubmit, sel.newInvoiceIsRequesting),
    policy: sel.policy,
    userid: sel.userid,
    username: sel.loggedInAsUsername,
    keyMismatch: sel.getKeyMismatch,
    name: sel.newInvoiceName,
    description: sel.newInvoiceDescription,
    files: sel.newInvoiceFiles,
    submitError: sel.newInvoiceError,
    merkle: sel.newInvoiceMerkle,
    token: sel.newInvoiceToken,
    signature: sel.newInvoiceSignature,
    draftInvoiceById: sel.draftInvoiceById
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewInvoice,
    onResetInvoice: act.onResetInvoice,
    onSaveDraft: act.onSaveDraftInvoice,
    onDeleteDraft: act.onDeleteDraftInvoice
  }
);

class NewInvoiceWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: props.draftInvoice || getNewInvoiceData(),
      validationError: ""
    };
  }

  componentDidUpdate(prevProps) {
    const { token, draftInvoice } = this.props;
    if (token) {
      if (this.props.draftInvoiceById) {
        this.props.onDeleteDraft(this.props.draftInvoiceById.draftId);
      }
      this.props.onResetInvoice();
      return this.props.history.push("/invoices/" + token);
    }

    const draftInvoiceDataAvailable = !prevProps.draftInvoice && draftInvoice;
    if (draftInvoiceDataAvailable) {
      this.setState({
        initialValues: draftInvoice
      });
    }
  }

  render() {
    const { Component } = this.props;
    const { validationError } = this.state;
    return (
      <Component
        {...{
          ...this.props,
          onSave: this.onSave.bind(this),
          initialValues: this.state.initialValues,
          validationError: validationError,
          onChange: this.onChange
        }}
      />
    );
  }

  onChange = () => {
    this.setState({ validationError: "" });
  };

  onSave = (...args) => {
    try {
      validate(...args);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
      return;
    }
    return this.props.onSave(...args);
  };
}

const wrap = Component => props => (
  <NewInvoiceWrapper {...{ ...props, Component }} />
);

export default compose(
  newInvoiceConnector,
  wrap
);
