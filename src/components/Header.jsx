//import React from "react";

import ContactList from "./ContactList";
import { Link } from "react-router-dom";

const Header = ({ toggleModal, nbOfContacts }) => {
  return (
    <header className="header">
      <div className="container">
        <h3>
          <Link to="" className="nav-link">
            Contact List({nbOfContacts})
          </Link>
        </h3>
        <button className="btn" onClick={() => toggleModal(true)}>
          <i className="bi bi-plus-square"></i> Add New Contact
        </button>
      </div>
    </header>
  );
};

export default Header;
