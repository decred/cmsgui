import React from "react";
import { DateTooltip } from "snew-classic-ui";
import { getProposalStatus } from "../../helpers";
import { withRouter } from "react-router-dom";
import * as modalTypes from "../Modal/modalTypes";
import actions from "../../connectors/actions";
import DownloadBundle from "../DownloadBundle";
import Message from "../Message";
import ProposalImages from "../ProposalImages";
import Tooltip from "../Tooltip";
import VersionPicker from "../VersionPicker";
// import Diff from "./Markdown/Diff";

const ToggleIcon = (type, onClick) => (
  <button className="collapse-icon-button" onClick={onClick}>
    <i className={`fa fa-${type}`} />
  </button>
);

class ThingLinkComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: !this.props.commentid
    };
  }
  hanldeExpandToggle = e => {
    e && e.preventDefault() && e.stopPropagation();
    this.setState(state => ({ expanded: !state.expanded }));
  };
  render() {
    const {
      Link,
      Expando,
      id,
      expanded = false,
      name,
      author,
      authorid,
      domain,
      rank = 0,
      draftId,
      version,
      subreddit,
      subreddit_id,
      created_utc,
      title,
      url,
      permalink,
      is_self,
      selftext,
      selftext_html,
      thumbnail,
      otherFiles,
      review_status,
      numcomments,
      lastSubmitted,
      openModal,
      setStatusProposalToken,
      onDeleteDraftProposal,
      setStatusProposalError,
      confirmWithModal,
      userId,
      comments,
      authorizeVoteToken,
      authorizeVoteError,
      startVoteToken,
      startVoteError,
      commentid
    } = this.props;
    const isEditable = authorid === userId;
    const disableEditButton = authorid !== userId;
    const hasComment = () => {
      return comments && comments.length > 0;
    };

    // errors
    const errorSetStatus =
      setStatusProposalToken === id && setStatusProposalError;
    const errorAuthorizeVote = authorizeVoteToken === id && authorizeVoteError;
    const errorStartVote = startVoteToken === id && startVoteError;
    const allErrors = [errorSetStatus, errorAuthorizeVote, errorStartVote];

    return (
      <div
        className={`thing thing-proposal id-${id} odd link`}
        data-author={author}
        data-author-fullname=""
        data-domain={domain}
        data-fullname={name}
        data-rank={rank}
        data-subreddit={subreddit}
        data-subreddit-fullname={subreddit_id}
        data-timestamp={created_utc}
        data-type="link"
        data-url={url}
        id={`thing_${name}`}
      >
        <p className="parent" />
        {thumbnail &&
        !["image", "default", "nsfw", "self"].find(sub => sub === thumbnail) ? (
          <Link className="thumbnail may-blank loggedin" href={url}>
            <img alt="Thumb" height={70} src={thumbnail} width={70} />
          </Link>
        ) : null}
        {is_self ? (
          <Link className="thumbnail self may-blank" href={url} />
        ) : null}
        <div className="entry unvoted">
          <span
            className="title"
            style={{ display: "flex", overflow: "visible" }}
          >
            <Link
              className="title may-blank loggedin"
              href={url}
              tabIndex={rank}
            >
              {title}{" "}
            </Link>{" "}
            {expanded && version > 1 ? (
              <VersionPicker
                onSelectVersion={selVersion => {
                  openModal(modalTypes.PROPOSAL_VERSION_DIFF, {
                    version: selVersion,
                    token: id
                  });
                }}
                version={version}
              />
            ) : null}
            {domain ? (
              <span className="domain">
                (<Link href={`/domain/${domain}/`}>{domain}</Link>)
              </span>
            ) : null}
            <div
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
            >
              {isEditable ? (
                <Link
                  href={`/proposals/${id}/edit`}
                  className="edit-proposal right-margin-10"
                  onClick={() => null}
                >
                  <i className="fa fa-edit right-margin-5" />
                  Edit
                </Link>
              ) : disableEditButton ? (
                <Tooltip
                  wrapperStyle={{ marginRight: "10px" }}
                  tipStyle={{ top: "20px", fontSize: "14px" }}
                  text="Revoke vote authorization to edit your proposal again."
                  position="bottom"
                >
                  <span style={{ color: "#bbb", cursor: "not-allowed" }}>
                    <i className="fa fa-edit right-margin-5" />
                    Edit
                  </span>
                </Tooltip>
              ) : null}
            </div>
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "5px"
            }}
          />

          <span className="tagline">
            <span className="submitted-by">
              {"submitted"}
              <DateTooltip createdAt={created_utc} />
              {author && (
                <span>
                  {" by "}
                  <Link href={`/user/${authorid}`}>{author}</Link>
                </span>
              )}{" "}
              {numcomments > 0 && (
                <span>
                  {" "}
                  - {numcomments}
                  {numcomments === 1 ? " comment" : " comments"}{" "}
                </span>
              )}
            </span>
          </span>
          {!draftId && (
            <p className="tagline proposal-token">
              {id} • {getProposalStatus(review_status)}
            </p>
          )}
          {draftId && (
            <div className="tagline proposal-draft">
              Saved as draft
              <span
                className="delete-draft"
                onClick={() => {
                  confirmWithModal(modalTypes.CONFIRM_ACTION, {
                    message: "Are you sure you want to delete this draft?"
                  }).then(ok => ok && onDeleteDraftProposal(draftId));
                }}
              >
                <i className="fa fa-trash" />
                Delete
              </span>
            </div>
          )}
          {expanded &&
            (lastSubmitted === id ? (
              <Message type="info">
                <span>
                  <p
                    style={{
                      marginTop: "0.4166667em",
                      marginBottom: "0.4166667em"
                    }}
                  >
                    Your proposal has been created, but it will not be public
                    until an admin approves it. You can{" "}
                    <DownloadBundle
                      message="download your proposal"
                      type="proposal"
                    />{" "}
                    and use the{" "}
                    <a
                      href="https://github.com/decred/politeia/tree/master/politeiad/cmd/politeia_verify"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      politeia_verify tool
                    </a>{" "}
                    to prove that your submission has been accepted for review
                    by Politeia. Once approved, an "Authorize Voting to Start"
                    button will appear. You will have 14 days to authorize a
                    proposal vote. If you fail to do so, your proposal will be
                    considered abandoned.
                  </p>
                </span>
              </Message>
            ) : hasComment() ? (
              <div>
                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <DownloadBundle type="proposal" />
                </div>
                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <DownloadBundle type="comments" />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <DownloadBundle type="proposal" /> <br />
              </div>
            ))}
          <Expando
            {...{
              expanded: this.state.expanded,
              collapseContent: !!commentid,
              is_self,
              selftext,
              selftext_html,
              expandIcon: ToggleIcon("expand", this.hanldeExpandToggle),
              compressIcon: ToggleIcon("compress", this.hanldeExpandToggle)
            }}
          />
          {this.state.expanded && (
            <ProposalImages readOnly files={otherFiles} />
          )}
          <ul
            className="flat-list buttons"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <li className="first">
              <Link
                className="bylink comments may-blank proposal-permalink"
                data-event-action="comments"
                href={permalink}
              >
                permalink
              </Link>
            </li>
          </ul>
          {allErrors.map((error, idx) =>
            error ? (
              <Message
                key={`error-${idx}`}
                type="error"
                header="Error setting proposal status"
                body={error}
              />
            ) : null
          )}
        </div>
        <div className="child" />
        <div className="clearleft" />
      </div>
    );
  }
}

export const ThingLink = actions(ThingLinkComp);

export default withRouter(ThingLink);
