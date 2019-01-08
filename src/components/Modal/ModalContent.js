import React from "react";
import * as modalTypes from "./modalTypes";
import ConfirmAction from "./contents/ConfirmAction";
import ConfirmActionWithReason from "./contents/ConfirmActionWithReason";
import Login from "./contents/Login";
import OnBoard from "./contents/OnBoard";
import ChangeUsernameModal from "./contents/ChangeUsernameModal";
import ChangePasswordModal from "./contents/ChangePasswordModal";
import ImportIdentityModal from "./contents/ImportIdentityModal";
import { withRouter } from "react-router-dom";

const mapModalTypeToContent = {
  [modalTypes.CONFIRM_ACTION]: ({ modalData }) => (
    <ConfirmAction me={modalData} />
  ),
  [modalTypes.CONFIRM_ACTION_WITH_REASON]: ({ modalData }) => (
    <ConfirmActionWithReason me={modalData} />
  ),
  [modalTypes.LOGIN]: ({ location, modalData }) => (
    <Login me={modalData} pathname={location.pathname} />
  ),
  [modalTypes.ONBOARD]: ({ modalData }) => <OnBoard me={modalData} />,
  [modalTypes.CHANGE_USERNAME_MODAL]: () => <ChangeUsernameModal />,
  [modalTypes.CHANGE_PASSWORD_MODAL]: () => <ChangePasswordModal />,
  [modalTypes.IMPORT_IDENTITY_MODAL]: () => <ImportIdentityModal />
};

const ModalContent = ({ modalData, location }) => {
  const mappedModal = mapModalTypeToContent[modalData.type];
  return mappedModal
    ? mappedModal({ modalData, location })
    : console.log("modal not mapped");
};

export default withRouter(ModalContent);
