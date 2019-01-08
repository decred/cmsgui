import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import { buildCommentsTree } from "../lib/snew";

const invoiceConnector = connect(
  sel.selectorMap({
    token: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    commentid: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "commentid"]),
      arg(1)
    ),
    tempThreadTree: sel.getTempThreadTree,
    userid: sel.userid,
    censoredComment: sel.censoredComment,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    invoice: sel.invoice,
    comments: sel.invoiceComments,
    commentslikes: sel.commentsLikes,
    error: or(sel.invoiceError), //, sel.apiPropVoteStatusError),
    isLoading: or(sel.invoiceIsRequesting, sel.setStatusInvoiceIsRequesting),
    markdownFile: sel.getMarkdownFile,
    otherFiles: sel.getNotMarkdownFile,
    commentsSortOption: sel.commentsSortOption,
    openedModals: sel.getopenedModals
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchInvoice,
        onSetReplyParent: act.onSetReplyParent
        //onFetchInvoiceVoteStatus: act.onFetchInvoiceVoteStatus,
        //onFetchLikedComments: act.onFetchLikedComments,
        //onSetCommentsSortOption: act.onSetCommentsSortOption,
        //resetLastSubmittedInvoice: act.resetLastSubmittedInvoice
      },
      dispatch
    )
);

class Wrapper extends React.PureComponent {
  componentDidMount() {
    this.props.onSetReplyParent();
  }

  handleViewAllClick = e => {
    e && e.preventDefault() && e.stopPropagation();
    this.props.history.push(`/invoices/${this.props.token}`);
  };

  // create data structure with all the comments on thread uniquely
  buildSetOfComments = tree => {
    const set = new Set();
    Object.keys(tree).forEach(key => {
      tree[key] && tree[key].forEach(item => item && set.add(item));
      key && key !== "0" && set.add(key);
    });
    return set;
  };

  render() {
    const { Component, ...props } = this.props;
    const { tree } = buildCommentsTree(props.comments, props.commentid);
    const commentsSet = this.buildSetOfComments(tree);
    return (
      <Component
        {...{
          ...props,
          onViewAllClick: this.handleViewAllClick,
          numofcomments: commentsSet.size
        }}
      />
    );
  }
}

const wrap = Component =>
  withRouter(
    invoiceConnector(props => <Wrapper {...{ ...props, Component }} />)
  );
export default wrap;
