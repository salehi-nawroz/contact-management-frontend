import React from "react";
import { Link } from "react-router-dom";

const Contact = ({ contact }) => {
  return (
    <Link to={`/contacts/${contact.id}`} className="contact_item">
      <div className="contact_header">
        <div className="contact_image">
          <img src={contact.photoUrl} alt={contact.name} />
        </div>
        <div className="contact_details">
          <p className="contact_name">{contact.name.substring(0, 20)}</p>
          <p className="contact_title">{contact.title}</p>
        </div>
      </div>
      <div className="contact_body">
        <p>
          <i className="bi bi-envelope">{contact.email.substring(0, 30)}</i>
        </p>
        <p>
          <i className="bi bi-geo">{contact.address}</i>
        </p>
        <p>
          <i className="bi bi-telephone">{contact.phone}</i>
        </p>
        <p>
          {contact.status === "Active" ? (
            <i className="bi bi-check-circle">Active</i>
          ) : (
            <i className="bi bi-x-circle">Inactive</i>
          )}
        </p>
      </div>
    </Link>
  );
};

export default Contact;
