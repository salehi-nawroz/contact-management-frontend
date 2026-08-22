import React from "react";
import Contact from "./Contact.jsx";

const ContactList = ({ data, currentPage, getAllContacts }) => {
  return (
    <main className="main">
      {data?.content?.length === 0 && (
        <div>No contacts found. Please add a new contact</div>
      )}
      <ul className="contact_list">
        {data?.content?.length > 0 &&
          data?.content?.map((contact) => (
            <Contact key={contact.id} contact={contact} />
          ))}
      </ul>
      {data?.content?.length > 0 && data?.totalPages > 1 && (
        <div className="pagination">
          <a
            onClick={() => getAllContacts(currentPage - 1)}
            className={currentPage === 0 ? "disabled" : ""}
          >
            &laquo;
          </a>
          {data &&
            [...Array(data?.totalPages)].map((page, index) => (
              <a
                key={index}
                onClick={() => getAllContacts(index)}
                className={currentPage === index ? "active" : ""}
              >
                {index + 1}
              </a>
            ))}
          <a
            onClick={() => getAllContacts(currentPage + 1)}
            className={data?.totalPages === currentPage + 1 ? "disabled" : ""}
          >
            &raquo;
          </a>
        </div>
      )}
      <div className="divider"></div>
    </main>
  );
};

export default ContactList;
