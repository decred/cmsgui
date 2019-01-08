import * as act from "../actions/types";
import { DEFAULT_REQUEST_STATE, request, receive } from "./util";

export const DEFAULT_STATE = {
  payWithFaucet: DEFAULT_REQUEST_STATE
};

const external_api = (state = DEFAULT_STATE, action) =>
  (({
    [act.REQUEST_GET_LAST_BLOCK_HEIGHT]: () =>
      request("blockHeight", state, action),
    [act.RECEIVE_GET_LAST_BLOCK_HEIGHT]: () =>
      receive("blockHeight", state, action)
  }[action.type] || (() => state))());

export default external_api;
