import { connect } from "react-redux";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin
  })
);
