import React from "react";
import actionsConnector from "../../connectors/actions";

const SubmitTextSidebox = ({ Link, loggedInAsEmail, isAdmin }) => {
  return loggedInAsEmail ? (
    !isAdmin ? (
      <div className="spacer">
        <div className="sidebox submit submit-text">
          <div className="morelink">
            <Link
              className="login-required access-required"
              data-event-action="submit"
              data-event-detail="self"
              data-type="subreddit"
              href="/invoices/new"
            />
            <div className="nub" />
          </div>
        </div>
      </div>
    ) : (
      <div className="spacer">
        <div className="sidebox submit invite-text">
          <div className="morelink">
            <Link
              className="login-required access-required"
              data-event-action="submit"
              data-event-detail="self"
              data-type="subreddit"
              href="/admin/invite"
            />
            <div className="nub" />
          </div>
        </div>
      </div>
    )
  ) : null;
};
export default actionsConnector(SubmitTextSidebox);
