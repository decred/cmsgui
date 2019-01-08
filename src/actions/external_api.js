import * as external_api from "../lib/external_api";
import act from "./methods";

let globalpollingpointer = null;

export const clearPollingPointer = () => clearTimeout(globalpollingpointer);
export const setPollingPointer = paymentpolling => {
  globalpollingpointer = paymentpolling;
};

export const getLastBlockHeight = isTestnet => dispatch => {
  dispatch(act.REQUEST_GET_LAST_BLOCK_HEIGHT());
  // try with dcrData if fail we try with insight api
  external_api
    .getHeightByDcrdata(isTestnet)
    .then(response => {
      return dispatch(act.RECEIVE_GET_LAST_BLOCK_HEIGHT(response));
    })
    .catch(() => {
      external_api
        .getHeightByInsight(isTestnet)
        .then(response => {
          return dispatch(
            act.RECEIVE_GET_LAST_BLOCK_HEIGHT(response.info.blocks)
          );
        })
        .catch(() => {
          return dispatch(act.RECEIVE_GET_LAST_BLOCK_HEIGHT(null));
        });
    });
};

export const resetPaywallPaymentWithFaucet = () =>
  act.RESET_PAYWALL_PAYMENT_WITH_FAUCET();
