import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { LIST_HEADER_UNVETTED } from "../constants";

export default connect(
  sel.selectorMap({
    showLookUp: () => true,
    filterValue: sel.getAdminFilterValue,
    header: () => LIST_HEADER_UNVETTED
  }),
  {
    onChangeFilter: act.onChangeAdminFilter
  }
);
