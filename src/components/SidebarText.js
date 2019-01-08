import React from "react";
import Markdown from "./snew/Markdown";
import modalConnector from "../connectors/modal";
import { ONBOARD } from "./Modal/modalTypes";
import UserBadge from "./UserBadge";

const aboutText = `
# About Contractor Management System

Decred is an autonomous digital currency. With a hybrid consensus system,
it is built to be a decentralized, sustainable, and self-ruling currency
where stakeholders make the rules.

Contractor Management System (CMS) is a censorship-resistant blockchain-anchored
semi-public contractor invoicing system, which empowers contractors to submit 
their own invoices for payment from DCR's treasury. CMS ensures the contractors
are able to be organized and paid in a timely fashion.
`;

const resourcesText = `
## Resources

 * [Website](https://decred.org/) & [Blog](https://blog.decred.org/)
 * [DCC proposal](https://proposals.decred.org/proposals/fa38a3593d9a3f6cb2478a24c25114f5097c572f6dadf24c78bb521ed10992a4)
 * [Decred Constitution](https://docs.decred.org/getting-started/constitution/)
 * [Whitepaper/Technical Brief (pdf)](https://decred.org/dtb001.pdf)
 * [Documentation](https://docs.decred.org/)
 * [Getting Started](https://decred.org/#guide)
 * [Source Code on Github](https://github.com/decred/)
 * [Network Status](https://stats.decred.org/) & [Block Explorer](https://mainnet.decred.org/)
 * [Voting Status](https://voting.decred.org/)
 * [Downloads Overview](https://decred.org/downloads/)
`;

const SidebarText = props => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <UserBadge />
    <Markdown
      body={aboutText}
      filterXss={false}
      confirmWithModal={null}
      displayExternalLikWarning={false}
      {...props}
    />
    <span
      style={{ cursor: "pointer", color: "#2971FF" }}
      onClick={e => {
        e.preventDefault();
        props.openModal(ONBOARD);
      }}
    >
      Learn More about CMS
    </span>
    <Markdown
      body={resourcesText}
      filterXss={false}
      displayExternalLikWarning={false}
      {...props}
    />
  </div>
);
export default modalConnector(SidebarText);
