import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import {
  SubmitPage,
  LoginSignupPage,
  Content as InvoiceListing
} from "./components/snew";
import userDetail from "./connectors/user";
import admin from "./connectors/admin";
import newInvoice from "./connectors/newInvoice";
import invoiceDetail from "./connectors/invoice";

import Logout from "./components/LogoutPage";
import UserLookup from "./components/UserLookupPage";
import SignupNext from "./components/SignupNextStepPage";
import ForgottenPassword from "./components/ForgottenPasswordPage";
import ForgottenPasswordSuccess from "./components/ForgottenPassword/SuccessPage";
import InviteUser from "./components/InviteUserPage";
import InviteUserSuccess from "./components/InviteUser/SuccessPage";
import PasswordReset from "./components/PasswordResetPage";
import PasswordResetSuccess from "./components/PasswordReset/SuccessPage";
import Verify from "./components/Verify";
import VerifyKey from "./components/VerifyKey";
import NotFound from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage/";
import UserDetail from "./components/UserDetail";
import UserInvoices from "./components/UserInvoices";
import InvoiceDetail from "./components/InvoiceDetail";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={InvoiceListing} exact />
        <Route path="/login" component={LoginSignupPage} />
        <Route path="/user/login" component={LoginSignupPage} />
        <Route path="/user/logout" component={Logout} />
        <Route path="/user/signup/next" component={SignupNext} />
        <Route path="/user/signup" component={LoginSignupPage} />
        <Route exact path="/password" component={ForgottenPassword} />
        <AuthenticatedRoute
          path="/user/invoices/:filter?"
          component={UserInvoices}
        />
        <Route
          exact
          path="/user/forgotten/password"
          component={ForgottenPassword}
        />
        <Route
          exact
          path="/user/forgotten/password/next"
          component={ForgottenPasswordSuccess}
        />
        <Route exact path="/user/password/reset" component={PasswordReset} />
        <Route
          exact
          path="/user/password/reset/next"
          component={PasswordResetSuccess}
        />
        <Route path="/user/verify" component={Verify} exact />
        <Route path="/user/key/verify" component={VerifyKey} exact />
        <AuthenticatedRoute
          path="/invoices/new"
          component={newInvoice(SubmitPage)}
        />
        <Route
          path="/invoices/:token"
          component={invoiceDetail(InvoiceDetail)}
          exact
        />
        <AdminAuthenticatedRoute
          path="/admin/censored"
          component={InvoiceListing}
        />
        <AdminAuthenticatedRoute
          path="/admin/unreviewed"
          component={InvoiceListing}
        />
        <AdminAuthenticatedRoute
          path="/admin/invite"
          component={admin(InviteUser)}
          exact
        />
        <AdminAuthenticatedRoute
          path="/admin/invite/next"
          component={admin(InviteUserSuccess)}
          exact
        />
        <AdminAuthenticatedRoute
          path="/admin"
          component={admin(InvoiceListing)}
          exact
        />
        <AdminAuthenticatedRoute path="/admin/users" component={UserLookup} />
        <Route path="/user/:userId" component={userDetail(UserDetail)} />
        <Route path="/500" component={ErrorPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;
