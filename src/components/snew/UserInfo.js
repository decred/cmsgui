import React from "react";
import { withRouter } from "react-router-dom";
import ReactBody from "react-body";
import currentUserConnector from "../../connectors/currentUser";
import Dropdown from "../Dropdown";
import Link from "./Link";

class UserInfo extends React.Component {
  render() {
    const {
      history,
      loggedInAsEmail,
      loggedInAsUsername,
      userCanExecuteActions,
      onLogout,
      loggedInAsUserId
    } = this.props;
    return loggedInAsEmail ? (
      <div id="header-right">
        <div id="header-right-content">
          <ReactBody className="loggedin" />
          <div className="user">
            <Dropdown
              DropdownTrigger={
                <div className="dropdown-trigger">{loggedInAsUsername}</div>
              }
              DropdownContent={
                <ul>
                  <li
                    className="dropdown-list-item"
                    onClick={() => history.push("/user/invoices")}
                  >
                    Invoices
                  </li>
                  <li
                    className="dropdown-list-item"
                    onClick={() => history.push(`/user/${loggedInAsUserId}`)}
                  >
                    Account
                  </li>
                  <li
                    className={`dropdown-list-item ${
                      !userCanExecuteActions ? "disabled" : ""
                    }`}
                    onClick={() =>
                      userCanExecuteActions
                        ? history.push("/invoices/new")
                        : null
                    }
                  >
                    Submit Invoice
                  </li>
                  <li
                    className="dropdown-list-item logout-button"
                    onClick={() => {
                      history.push("/user/logout");
                      onLogout();
                    }}
                  >
                    <form className="logout hover" />
                    Log out
                  </li>
                </ul>
              }
            />
          </div>
        </div>
      </div>
    ) : (
      <div id="header-right">
        <div id="header-right-content">
          <Link href="/user/signup" className="login-required">
            Log in or sign up
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(currentUserConnector(UserInfo));
