import get from "lodash/fp/get";
import map from "lodash/fp/map";
import reduce from "lodash/fp/reduce";
import compose from "lodash/fp/compose";
import union from "lodash/fp/union";
import { TOP_LEVEL_COMMENT_PARENTID } from "./api";

export const invoiceToT3 = (
  {
    year,
    month,
    signature,
    file,
    publickey,
    timestamp,
    status,
    userid,
    username,
    numcomments,
    censorshiprecord = {},
    draftId = "",
    version,
    statuschangereason
  },
  idx
) => ({
  kind: "t3",
  data: {
    year,
    month,
    signature,
    file,
    publickey,
    authorid: userid,
    author: username,
    numcomments,
    rank: idx + 1,
    title: username + " " + year + " " + month,
    id: censorshiprecord.token,
    name: "t3_" + censorshiprecord.token,
    review_status: status,
    created_utc: timestamp,
    permalink: `/invoices/${censorshiprecord.token ||
      (draftId ? `new?draftid=${draftId}` : "")}`,
    url: `/invoices/${censorshiprecord.token ||
      (draftId ? `new?draftid=${draftId}` : "")}`,
    is_self: true,
    draftId,
    version,
    censorMessage: statuschangereason
  }
});

export const formatInvoiceData = (invoice, idx) => invoiceToT3(invoice, idx);

const getChildComments = ({ tree, comments }, parentid) =>
  map(
    compose(
      data => ({
        kind: "t1",
        data: {
          ...data,
          replies: {
            data: {
              children:
                (data.id && getChildComments({ tree, comments }, data.id)) || []
            }
          }
        }
      }),
      id => comments[id]
    ),
    get(parentid || TOP_LEVEL_COMMENT_PARENTID, tree) || []
  );

// get filtered thread tree if commentid exists, returns the existing tree if not
const getTree = ({ tree, comments }, commentid, tempThreadTree) => {
  let newTree = {};
  if (commentid) {
    const getChildren = (tree, commentid) => {
      newTree = {
        ...newTree,
        [commentid]: tree[commentid]
      };
      tree[commentid] &&
        tree[commentid].forEach(item => getChildren(tree, item));
    };
    const getParents = (tree, commentid) => {
      const firstlevel = Object.keys(tree);
      firstlevel.forEach(key => {
        if (tree[key].find(item => item === commentid)) {
          // find the comment parent
          newTree = {
            ...newTree,
            [key]: [commentid]
          };
          getParents(tree, key);
        }
      });
    };
    getChildren(tree, commentid);
    getParents(tree, commentid);
    if (tempThreadTree) {
      Object.keys(tempThreadTree).forEach(newKey => {
        newTree = {
          ...newTree,
          [newKey]: union(newTree[newKey], tempThreadTree[newKey])
        };
      });
    }
    return { tree: newTree, comments };
  }
  return { tree, comments };
};

// compose JS reduce and getTree, will return a {tree, comments} object
export const buildCommentsTree = (comments, commentid, tempThreadTree) =>
  compose(
    obj => getTree(obj, commentid, tempThreadTree),
    reduce(
      (
        r,
        {
          commentid,
          userid,
          username,
          parentid,
          token,
          comment,
          timestamp,
          resultvotes,
          vote,
          censored
        }
      ) => ({
        ...r,
        comments: {
          ...r.comments,
          [commentid]: {
            id: commentid,
            uservote: String(vote),
            author: username,
            authorid: userid,
            censored,
            score: resultvotes,
            score_hidden: false,
            parent_id: parentid || TOP_LEVEL_COMMENT_PARENTID,
            name: commentid,
            body: comment,
            created_utc: timestamp,
            permalink: `/invoices/${token}/comments/${commentid}`
          }
        },
        tree: {
          ...r.tree,
          [parentid || TOP_LEVEL_COMMENT_PARENTID]: [
            ...(get(["tree", parentid || TOP_LEVEL_COMMENT_PARENTID], r) || []),
            commentid
          ]
        }
      }),
      { tree: {}, comments: {} }
    )
  )(comments);

export const commentsToT1 = (comments, commentid, tempThreadTree) => {
  return compose(
    getChildComments,
    comments => buildCommentsTree(comments, commentid, tempThreadTree)
  )(comments);
};
