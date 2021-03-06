import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";

const thingLinkConnector = connect(
  sel.selectorMap({
    commentid: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "commentid"]),
      arg(1)
    ),
    //isInvoiceStatusApproved: sel.isInvoiceStatusApproved,
    userId: sel.userid,
    lastBlockHeight: sel.lastBlockHeight,
    isTestnet: sel.isTestNet,
    //getVoteStatus: sel.getPropVoteStatus,
    //comments: sel.proposalComments,
    csrf: sel.csrf
  }),
  {
    confirmWithModal: act.confirmWithModal,
    //onChangeInvoiceStatusApproved: act.onChangeInvoiceStatusApproved,
    getLastBlockHeight: act.getLastBlockHeight
  }
);

export default thingLinkConnector;
