import { useState, useEffect, useRef } from "react";
import { getContacts, saveContact, updatePhoto } from "./api/contactService";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header.jsx";
import ContactList from "./components/ContactList.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import ContactDetail from "./components/ContactDetail.jsx";
import { toastError, toastSuccess } from "./api/ToastService.js";
import { ToastContainer } from "react-toastify";
function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: "",
    email: "",
    title: "",
    phone: "",
    address: "",
    status: "",
  });
  const getAllContacts = async (page = 0, size = 6) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (error) {
      toastError(error.message);
    }
  };
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      if (file != null) {
        const { data } = await saveContact(values);
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("id", data.id);

        const { data: photoUrl } = await updatePhoto(formData);

        toggleModal(false);
        setFile(undefined);
        fileRef.current.value = null;
        setValues({
          name: "",
          email: "",
          title: "",
          phone: "",
          address: "",
          status: "",
        });
        toastSuccess("New contact added successfully.");
        getAllContacts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadPhoto = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      alert("select a piture only");

      event.target.value = "";
      setFile(null);

      return;
    }

    setFile(selectedFile);
  };

  const updateContact = async (contact) => {
    try {
      const { data } = await saveContact(contact);
      console.log(data);
      toastSuccess("User updated successfully.");
      getAllContacts();
    } catch (error) {
      console.log(error);
    }
  };
  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const toggleModal = (show) =>
    show ? modalRef.current.showModal() : modalRef.current.close();
  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            />
            <Route
              path="/contacts/:id"
              element={
                <ContactDetail
                  updateContact={updateContact}
                  updateImage={updateImage}
                  setFile={setFile}
                  getAllContacts={getAllContacts}
                />
              }
            />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog id="modal" ref={modalRef} className="modal">
        <div className="header">
          <div className="container">
            <h3>New Contact</h3>
            <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
          </div>
        </div>
        {/* <div className="divider"></div> */}
        <div className="modal-body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={values.name}
                  onChange={onChange}
                  name="name"
                  required
                />
              </div>

              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="email"
                  value={values.email}
                  onChange={onChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={values.title}
                  onChange={onChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={values.phone}
                  onChange={onChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={values.address}
                  onChange={onChange}
                  name="address"
                  required
                />
              </div>

              <div className="input-box">
                <span className="details">Account Status</span>

                <select
                  value={values.status}
                  onChange={onChange}
                  name="status"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="file-input">
                <span className="details">Profile Photo</span>
                <p className="profile_muted">
                  JPG, GIF, or PNG. Max size of 10MG
                </p>
                <input
                  type="file"
                  onChange={() => handleUploadPhoto(event)}
                  ref={fileRef}
                  name="photo"
                  required
                />
              </div>
            </div>

            <div className="form_footer">
              <button
                type="button"
                onClick={() => toggleModal(false)}
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
