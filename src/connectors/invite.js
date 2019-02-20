import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const invite = connect(
  sel.selectorMap({
    inviteUserResponse: sel.inviteUserResponse,
    isRequesting: sel.isApiRequestingInviteUser,
    policy: sel.policy
  }),
  {
    resetInviteUser: act.resetInviteUser,
    onInviteUserConfirm: act.onInviteUserConfirm,
    onInviteUser: act.onInviteUser,
    onFetchData: act.onGetPolicy
  }
);

export default invite;
