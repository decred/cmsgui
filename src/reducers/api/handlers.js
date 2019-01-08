import get from "lodash/fp/get";
import cloneDeep from "lodash/cloneDeep";
import { receive } from "../util";
import {
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_UNLOCK,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_REACTIVATE
} from "../../constants";

export const onReceiveSetStatus = (state, action) => {
  state = receive("setStatusInvoice", state, action);
  if (action.error) return state;
  const invoicesVoteStatus =
    get(["invoicesVoteStatus", "response", "votesstatus"], state) || [];
  //const getInvoiceToken = prop => get(["censorshiprecord", "token"], prop);

  const updatedInvoice = {
    ...action.payload.invoice,
    files: get(["invoice", "response", "invoice", "files"], state) || [],
    username: get(["invoice", "response", "invoice", "username"], state) || ""
  };

  const viewedInvoice = get(["invoice", "response", "invoice"], state);

  /*
  const updateInvoiceStatus = invoice =>
    getInvoiceToken(updatedInvoice) === getInvoiceToken(invoice)
      ? updatedInvoice
      : invoice;
  */
  const unvettedProps = get(["unvetted", "response", "invoices"], state) || [];
  const vettedProps = get(["vetted", "response", "invoices"], state) || [];

  return {
    ...state,
    invoice: viewedInvoice
      ? {
          ...state.invoice,
          response: {
            ...state.invoice.response,
            invoice: updatedInvoice
          }
        }
      : state.invoice,
    unvetted: {
      ...state.unvetted,
      response: {
        ...state.unvetted.response,
        invoices: unvettedProps
      }
    },
    vetted: {
      ...state.vetted,
      response: {
        ...state.vetted.response,
        invoices: vettedProps
      }
    },
    invoicesVoteStatus: {
      ...state.invoicesVoteStatus,
      response: {
        ...state.invoicesVoteStatus.response,
        votesstatus: invoicesVoteStatus
      }
    }
  };
};

export const onReceiveCensoredComment = (state, action) => {
  state = receive("censorComment", state, action);
  if (action.error) return state;

  return {
    ...state,
    invoiceComments: {
      ...state.invoiceComments,
      response: {
        ...state.invoiceComments.response,
        comments: state.invoiceComments.response.comments.map(c => {
          return c.commentid === action.payload
            ? { ...c, comment: "", censored: true }
            : c;
        })
      }
    }
  };
};

export const onReceiveNewComment = (state, action) => {
  state = receive("newComment", state, action);
  if (action.error) return state;
  return {
    ...state,
    invoiceComments: {
      ...state.invoiceComments,
      response: {
        ...state.invoiceComments.response,
        comments: [
          ...state.invoiceComments.response.comments,
          {
            ...state.newComment.payload,
            token: state.invoice.payload,
            userid: state.newComment.response.userid,
            username: state.me.response.username,
            isadmin: state.me.response.isadmin,
            totalvotes: 0,
            resultvotes: 0,
            commentid: state.newComment.response.commentid,
            timestamp: Date.now() / 1000
          }
        ]
      }
    }
  };
};

export const onResetSyncLikeComment = state => {
  const { backup: commentsLikesBackup } = state.commentslikes;
  const { backup: invoiceCommentsBackup } = state.invoiceComments;
  return {
    ...state,
    commentslikes: {
      ...state.commentslikes,
      backup: null,
      response: {
        commentslikes: commentsLikesBackup
      }
    },
    invoiceComments: {
      ...state.invoiceComments,
      backup: null,
      response: {
        ...state.invoiceComments.response,
        comments: invoiceCommentsBackup
      }
    }
  };
};

export const onReceiveInvoiceVoteResults = (key, state, action) => {
  state = receive(key, state, action);
  if (action.error) return state;

  const hashmap = state.invoiceVoteResults.response.castvotes.reduce(
    (map, obj) => {
      map[obj.ticket] = obj;
      return map;
    },
    {}
  );

  return {
    ...state,
    invoiceVoteResults: {
      ...state.invoiceVoteResults,
      response: {
        ...state.invoiceVoteResults.response,
        castvotes: hashmap
      }
    }
  };
};

export const onReceiveSyncLikeComment = (state, action) => {
  const { token, action: cAction, commentid } = action.payload;
  const newAction = parseInt(cAction, 10);

  const commentslikes =
    state.commentslikes.response && state.commentslikes.response.commentslikes;
  const backupCV = cloneDeep(commentslikes);
  const comments =
    state.invoiceComments.response && state.invoiceComments.response.comments;

  let reducedVotes = null;
  const cvfound =
    commentslikes &&
    commentslikes.find(cv => cv.commentid === commentid && cv.token === token);

  if (cvfound) {
    reducedVotes = commentslikes.reduce(
      (acc, cv) => {
        if (cv.commentid === commentid && cv.token === token) {
          const currentAction = parseInt(cv.action, 10);
          acc.oldAction = currentAction;
          cv = {
            ...cv,
            action: newAction === currentAction ? 0 : newAction
          };
        }
        return { ...acc, cvs: acc.cvs.concat([cv]) };
      },
      { cvs: [], oldAction: null }
    );
  } else {
    const newCommentVote = { token, commentid, action: newAction };
    reducedVotes = {
      cvs: commentslikes
        ? commentslikes.concat([newCommentVote])
        : [newCommentVote],
      oldAction: 0
    };
  }

  const { cvs: newCommentsLikes, oldAction } = reducedVotes;

  return {
    ...state,
    commentslikes: {
      ...state.commentslikes,
      backup: backupCV,
      response: {
        commentslikes: newCommentsLikes
      }
    },
    invoiceComments: {
      ...state.invoiceComments,
      backup: comments,
      response: {
        ...state.invoiceComments.response,
        comments: state.invoiceComments.response.comments.map(el =>
          el.commentid === commentid
            ? {
                ...el,
                totalvotes:
                  el.totalvotes +
                  (oldAction === newAction ? -1 : oldAction === 0 ? 1 : 0),
                resultvotes:
                  el.resultvotes +
                  (oldAction === newAction ? -oldAction : newAction - oldAction)
              }
            : el
        )
      }
    }
  };
};

export const onReceiveVoteStatusChange = (key, newStatus, state, action) => {
  state = receive(key, state, action);
  if (action.error) return state;

  const newVoteStatus = {
    token: state[key].payload.token,
    status: newStatus,
    optionsresult: null,
    totalvotes: 0
  };
  return {
    ...state,
    invoicesVoteStatus: {
      ...state.invoicesVoteStatus,
      response: {
        ...state.invoicesVoteStatus.response,
        votesstatus:
          state.invoicesVoteStatus.response &&
          state.invoicesVoteStatus.response.votesstatus
            ? state.invoicesVoteStatus.response.votesstatus.map(vs =>
                newVoteStatus.token === vs.token ? newVoteStatus : vs
              )
            : [newVoteStatus]
      }
    },
    invoiceVoteStatus: {
      ...state.invoicesVoteStatus,
      response: {
        ...state.invoiceVoteStatus.response,
        ...newVoteStatus
      }
    }
  };
};

export const receiveInvoices = (key, invoices, state) => {
  //const isUnvetted = false;

  /*
    prop =>
    prop.status === PROPOSAL_STATUS_UNREVIEWED ||
    prop.status === PROPOSAL_STATUS_CENSORED ||
    prop.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES;
  */
  const lastLoaded = invoices.length > 0 ? invoices[invoices.length - 1] : null;

  //const unvettedProps =
  //  (state.unvetted.response && state.unvetted.response.invoices) || [];
  //const vettedProps =
  //  (state.vetted.response && state.vetted.response.invoices) || [];
  //const incomingUnvettedProps = invoices;
  //const incomingVettedProps = invoices.filter(prop => !isUnvetted(prop));
  return {
    ...state,
    lastLoaded: {
      ...state.lastLoaded,
      [key]: lastLoaded
    }
  };
};

export const onReceiveInvoices = (key, state, { payload, error }) => {
  const auxPayload = cloneDeep(payload);
  if (auxPayload.invoices) {
    delete auxPayload.invoices;
  }

  state = {
    ...state,
    [key]: {
      ...state[key],
      response: {
        ...state[key].response,
        invoices: payload.invoices
      },
      isRequesting: false,
      error: error ? payload : null
    }
  };

  const invoices = payload.invoices || [];
  return receiveInvoices(key, invoices, state);
};

export const onReceiveUser = (state, action) => {
  state = receive("user", state, action);
  if (action.error) return state;

  const userProps = action.payload.user.invoices || [];
  return receiveInvoices("user", userProps, state);
};

export const onReceiveManageUser = (state, action) => {
  state = receive("manageUser", state, action);
  if (action.error) return state;

  const getExpiredTime = () => {
    const oneHourInMilliseconds = 1000 * 60 * 60;
    return (new Date().getTime() - 168 * oneHourInMilliseconds) / 1000; // -168 hours is 7 days in the past
  };
  const manageUserPayload = get(["manageUser", "payload"], state);
  const user = get(["user", "response", "user"], state);
  const { action: manageAction } = manageUserPayload;

  switch (manageAction) {
    case MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION:
      user.newuserverificationexpiry = getExpiredTime();
      break;
    case MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION:
      user.updatekeyverificationexpiry = getExpiredTime();
      break;
    case MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION:
      user.resetpasswordverificationexpiry = getExpiredTime();
      break;
    case MANAGE_USER_CLEAR_USER_PAYWALL:
      user.newuserpaywalladdress = "";
      user.newuserpaywallamount = 0;
      break;
    case MANAGE_USER_UNLOCK:
      user.islocked = false;
      break;
    case MANAGE_USER_DEACTIVATE:
      user.isdeactivated = true;
      break;
    case MANAGE_USER_REACTIVATE:
      user.isdeactivated = false;
      break;
    default:
      break;
  }
  return {
    ...state,
    user: {
      ...state.user,
      response: {
        ...state.user.response,
        user: user
      }
    }
  };
};
