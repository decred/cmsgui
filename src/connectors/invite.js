import React, { Component } from "react";
import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../validators/signup";
import { withRouter } from "react-router-dom";
import { SubmissionError } from "redux-form";

const inviteFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    policy: sel.policy,
    newUserResponse: sel.newUserResponse,
    isApiRequestingLogin: sel.isApiRequestingLogin,
    isApiRequestingNewUser: or(
      sel.isApiRequestingInit,
      sel.isApiRequestingNewUser
    ),
    isApiRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
    apiNewUserError: sel.apiNewUserError,
    apiVerifyNewUserError: sel.apiVerifyNewUserError,
    isShowingInviteConfirmation: sel.isShowingInviteConfirmation,
    csrf: sel.csrf
  }),
  {
    onFetchData: act.onGetPolicy,
    onSignup: act.onSignup,
    onSignupConfirm: act.onSignupConfirm,
    onResetSignup: act.onResetSignup
  }
);

class Wrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasFetchedPolicy: false
    };
  }

  componentDidMount() {
    if (this.props.csrf) {
      this.props.policy || this.props.onFetchData();
    }
  }

  componentDidUpdate() {
    if (this.props.loggedInAsEmail) {
      if (this.props.isAdmin) {
        this.props.history.push("/admin/");
      } else {
        this.props.history.push("/user/proposals");
      }
    } else if (this.props.newUserResponse) {
      this.props.history.push("/user/signup/next");
    }

    const { hasFetchedPolicy } = this.state;
    if (hasFetchedPolicy) return;

    if (this.props.csrf) {
      this.setState({ hasFetchedPolicy: true });
      this.props.policy || this.props.onFetchData();
    }
  }

  componentWillUnmount() {
    // Reset form?
  }

  render() {
    const Component = this.props.Component;
    return (
      <Component
        {...{
          ...this.props,
          onInvite: this.onInvite.bind(this)
        }}
      />
    );
  }

  onInvite(args) {
    args = {
      ...args,
      email: (args.email || "").trim()
    };

    const policy = this.props.policy || {};
    validate(policy, args);
    const { error } = this.props;
    if (error) {
      this.props.clearSubmitErrors();
    }

    if (!this.props.isShowingInviteConfirmation) {
      return this.props.onInvite();
    }

    const promise = this.props.onInviteConfirm(args);
    if (promise) {
      return promise.catch(e => {
        throw new SubmissionError({
          _error: e.message
        });
      });
    }
  }
}

const wrap = Component =>
  inviteFormConnector(props => <Wrapper {...{ ...props, Component }} />);

export default compose(
  reduxForm({ form: "form/invite" }),
  withRouter,
  wrap
);
