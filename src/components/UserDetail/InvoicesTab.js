import React from "react";
import userConnector from "../../connectors/user";
import { Content as InvoiceListing } from "../../components/snew";

const InvoicesTab = ({
  user,
  loggedInAsEmail,
  isAdmin,
  onFetchUserInvoices,
  count,
  lastLoadedInvoice,
  lastLoadedUserDetailInvoice,
  getSubmittedUserInvoices,
  isLoadingInvoices
}) => {
  return (
    <div className="detail-proposals">
      <InvoiceListing
        isLoading={isLoadingInvoices}
        loggedInAsEmail={loggedInAsEmail}
        isAdmin={isAdmin}
        count={count}
        userid={user.id}
        lastLoadedInvoice={
          lastLoadedInvoice && Object.keys(lastLoadedInvoice).length > 0
            ? lastLoadedInvoice
            : lastLoadedUserDetailInvoice
        }
        invoices={getSubmittedUserInvoices(user.id)}
        onFetchUserInvoices={onFetchUserInvoices}
        emptyProposalsMessage={"This user has not submitted any proposals"}
      />
    </div>
  );
};

export default userConnector(InvoicesTab);
