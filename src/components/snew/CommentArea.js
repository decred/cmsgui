import React from "react";
import Select from "react-select";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import { TOP_LEVEL_COMMENT_PARENTID } from "../../lib/api";
import invoiceConnector from "../../connectors/invoice";
import { SORT_BY_TOP, SORT_BY_OLD, SORT_BY_NEW } from "../../constants";

const CommentArea = ({
  comments,
  loggedInAsEmail,
  invoice,
  onSetCommentsSortOption,
  commentsSortOption,
  commentid,
  onViewAllClick,
  token,
  numofcomments,
  ...props
}) =>
  Object.keys(invoice).length === 0 ? null : (
    <CommentAreaBase
      {...{
        ...props,
        singleThread: commentid ? (
          <span>
            Single comment thread.{" "}
            <a href={`invoices/${token}`} onClick={onViewAllClick}>
              View all
            </a>
          </span>
        ) : null,
        locked: !loggedInAsEmail,
        name: TOP_LEVEL_COMMENT_PARENTID,
        num_comments: numofcomments,
        SorterComponent: () =>
          comments && numofcomments > 0 ? (
            <div className="comments-sort">
              <span className="">Sort by:</span>
              <Select
                onKeyDown={e => e.keyCode === 8 && e.preventDefault()}
                classNamePrefix="sort-select"
                isSearchable={false}
                isClearable={false}
                escapeClearsValue={false}
                value={commentsSortOption}
                onChange={onSetCommentsSortOption}
                options={[SORT_BY_NEW, SORT_BY_OLD, SORT_BY_TOP].map(op => ({
                  value: op,
                  label: op
                }))}
              />
            </div>
          ) : null,
        hideSortOptions: false
      }}
    />
  );

export default invoiceConnector(CommentArea);
