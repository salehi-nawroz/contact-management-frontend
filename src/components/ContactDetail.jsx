import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { getContact, deleteContact } from "../api/contactService";
import { toastError, toastSuccess } from "../api/ToastService";

const ContactDetail = ({
  updateContact,
  updateImage,
  setFile,
  getAllContacts,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef();
  const [contact, setContact] = useState({
    id: "",
    name: "",
    email: "",
    title: "",
    phone: "",
    address: "",
    status: "",
    photoUrl: "",
  });
  const { id } = useParams();
  const fetchContact = async (id) => {
    try {
      const { data } = await getContact(id);
      setContact(data);
    } catch (error) {
      console.log(error);
      toastError("Data not loaded");
    }
  };
  const selectImage = () => {
    inputRef.current.click();
  };
  const updatePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", id);

      const selectedFile = file;

      if (!selectedFile) {
        return;
      }

      if (!selectedFile.type.startsWith("image/")) {
        toastError("Please select an image file only.");

        event.target.value = "";
        setFile(undefined);

        return;
      }

      setFile(selectedFile);

      await updateImage(formData);
      setContact((prev) => ({
        ...prev,
        photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`,
      }));
      console.log("data");
      toastSuccess("Photo updated");
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const onChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };
  const onUpdateContact = async (event) => {
    event.preventDefault();
    await updateContact(contact);
    navigate("/contacts");
    //fetchContact(id);
    // toastSuccess("Contact Updated");
  };

  const removeContact = async () => {
    try {
      await deleteContact(contactToDelete);

      const updatedContacts = await getAllContacts();
      setContact(updatedContacts);

      setShowDeleteModal(false);
      setContactToDelete(null);

      toastSuccess("Contact deleted successfully!");

      navigate("/");
    } catch (error) {
      setShowDeleteModal(false);
      setContactToDelete(null);

      toastError(error);
    }
  };

  const askDeleteContact = (id) => {
    setContactToDelete(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchContact(id);
  }, []);
  return (
    <>
      <Link to="/" className="link">
        <i className="bi bi-arrow-left">Back to list</i>
      </Link>
      <div className="profile">
        <div className="profile_details">
          <img
            src={contact.photoUrl}
            alt={`Profile photo of ${contact.name}`}
          />
          <div className="profile_metadata">
            <p className="profile_name">{contact.name}</p>
            <p className="profile_muted">JPG, GIF, or PNG. Max size of 10MG</p>
            <button onClick={selectImage} className="btn">
              <i className="bi bi-cloud-upload"></i>Change Photo
            </button>
          </div>
          <div className="delete_contact">
            <i
              onClick={() => askDeleteContact(contact.id)}
              className="btn btn-danger bi bi-x-lg"
            ></i>
          </div>
        </div>
        <div className="profile_settings">
          <div>
            <form onSubmit={onUpdateContact} className="form">
              <div className="user-details">
                <input
                  type="hidden"
                  defaultValue={contact.id}
                  name="id"
                  required
                />

                <div className="input-box">
                  <span className="details">Name</span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={onChange}
                    name="name"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="text"
                    value={contact.email}
                    onChange={onChange}
                    name="email"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Phone</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={contact.phone}
                    onChange={onChange}
                    name="phone"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Address</span>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={onChange}
                    name="address"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Title</span>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={onChange}
                    name="title"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Status</span>
                  <select
                    value={contact.status}
                    onChange={onChange}
                    name="status"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form_footer">
                <button
                  type="button"
                  onClick={() => navigate("/contacts")}
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
        </div>
        <form style={{ display: "none" }}>
          <input
            type="file"
            ref={inputRef}
            onChange={(event) => updatePhoto(event.target.files[0])}
            name="file"
            accept="image/*"
          />
        </form>
      </div>
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        onConfirm={removeContact}
        onCancel={() => {
          setShowDeleteModal(false);
          setContactToDelete(null);
        }}
      />
    </>
  );
};

export default ContactDetail;
