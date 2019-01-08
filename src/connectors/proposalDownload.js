import { connect } from "react-redux";
import * as sel from "../selectors";

const proposalDownloadConnector = connect(
  sel.selectorMap({
    invoice: sel.invoice,
    serverPubkey: sel.serverPubkey
  })
);

export default proposalDownloadConnector;
