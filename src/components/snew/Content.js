import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { formatInvoiceData } from "../../lib/snew";
import Link from "./Link";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";
import Message from "../Message";
import thingLinkConnector from "../../connectors/thingLink";

export const CustomContent = ({
  bodyClassName = "listing-page",
  listings,
  invoices,
  invoiceCounts,
  emptyInvoicesMessage = "There are no invoices yet",
  isLoading,
  error,
  userid,
  header,
  lastLoadedInvoice,
  filterValue,
  activeVotes,
  onFetchData,
  onFetchUserInvoices,
  count,
  showLookUp,
  commentid,
  comments,
  ...props
}) => {
  const invalidcomment =
    !isLoading &&
    (commentid && comments && !comments.find(c => c.commentid === commentid));
  const showList =
    (listings && listings.length > 0) ||
    (invoices && invoices.length > 0) ||
    (invoiceCounts && filterValue >= 0 && invoiceCounts[filterValue]) !== 0;
  const showLoadMore =
    invoices &&
    ((count && count > invoices.length) ||
      (invoiceCounts &&
        filterValue >= 0 &&
        invoiceCounts[filterValue] > invoices.length));
  const content = error ? (
    <Message type="error" header="Error loading invoices" body={error} />
  ) : isLoading ? (
    <PageLoadingIcon key="content" />
  ) : invalidcomment ? (
    <Message
      type="error"
      header="Comment not found"
      body="Could not find comment"
    />
  ) : (
    <div>
      {header && (
        <div
          style={
            showLookUp
              ? {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              : {}
          }
        >
          <h1 className="proposals-listing-header">{header}</h1>
          {showLookUp && (
            <Link
              style={{ marginRight: "24px" }}
              href="/admin/users"
              onClick={() => null}
            >
              <i className="fa fa-search right-margin-5" />
              Search users
            </Link>
          )}
        </div>
      )}
      {showList ? (
        <React.Fragment>
          <Content
            {...{
              ...props,
              highlightcomment: commentid,
              key: "content",
              lastBlockHeight: props.lastBlockHeight,
              listings: listings || [
                {
                  allChildren: invoices
                    ? invoices.map((invoice, idx) =>
                        formatInvoiceData(invoice, idx, activeVotes)
                      )
                    : []
                }
              ]
            }}
          />
          {showLoadMore && (
            <div
              style={{ width: "100%", maxWidth: "1000px", textAlign: "center" }}
            >
              <button
                style={{ marginTop: "15px" }}
                className="c-btn c-btn-primary"
                onClick={() =>
                  onFetchData
                    ? onFetchData(
                        lastLoadedInvoice
                          ? lastLoadedInvoice.censorshiprecord.token
                          : null
                      )
                    : onFetchUserInvoices(
                        userid,
                        lastLoadedInvoice
                          ? lastLoadedInvoice.censorshiprecord.token
                          : null
                      )
                }
              >
                Load More
              </button>
            </div>
          )}
        </React.Fragment>
      ) : (
        <h1 style={{ textAlign: "center", paddingTop: "125px", color: "#777" }}>
          {emptyInvoicesMessage}
        </h1>
      )}
    </div>
  );

  return [
    <ReactBody className={bodyClassName} key="body" />,
    <div className="content" role="main" key="content">
      {content}
    </div>
  ];
};

class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetched: false
    };
  }

  componentDidMount() {}

  componentDidUpdate() {
    const { csrf } = this.props;
    const { isFetched } = this.state;
    const { getLastBlockHeight, isTestnet } = this.props;
    if (isFetched) return;
    else if (csrf) {
      this.setState({ isFetched: true });
      this.props.onFetchData && this.props.onFetchData();
      this.props.onFetchStatus && this.props.onFetchStatus();
      getLastBlockHeight && getLastBlockHeight(isTestnet);
    }
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default thingLinkConnector(Loader);
