
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, Mail, Camera, Pencil, LogOut, X, Save,} from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get( "http://localhost:5000/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.user;

      setUser(userData);

      setFormData({ username: userData?.username || "", name: userData?.name || "",
        email: userData?.email || "", });

      if (userData?.profilePicture) {
        setPreview(
          userData.profilePicture.startsWith("http")
            ? userData.profilePicture
            : `http://localhost:5000${userData.profilePicture}`
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImage(selectedImage);

    setPreview(
      URL.createObjectURL(selectedImage)
    );
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setImage(null);

    setFormData({ username: user?.username || "", name: user?.name || "",
      email: user?.email || "", });

    if (user?.profilePicture) {
      setPreview(
        user.profilePicture.startsWith("http")
          ? user.profilePicture
          : `http://localhost:5000${user.profilePicture}`
      );
    } else {
      setPreview("");
    }
  };

 
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("username", formData.username);
      data.append("name", formData.name);
      data.append("email", formData.email);

      if (image) {
        data.append("profilePicture", image);
      }

      const res = await axios.put(
        "http://localhost:5000/auth/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("fittrack_auth_change"));
      }

      toast.success(
        "Profile updated successfully"
      );

      setEditMode(false);
      setImage(null);

      getProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("fittrack_auth_change"));

    toast.success("Logout successful");

    navigate("/login");
  };


  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-wrapper">

        <div className="profile-header">

          <div>
            <span className="profile-label">
              FITTRACK
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your account information
            </p>
          </div>

          <button className="profile-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>

        </div>


        <div className="profile-card">


          <div className="profile-main">


            <div className="profile-avatar-area">

              <div className="profile-avatar">

                {preview ? (
                  <img src={preview} alt="Profile"/>
                ) : (
                  <User size={48} />
                )}

              </div>

              {editMode && (
                <>
                  <label htmlFor="profile-image" className="profile-camera">
                    <Camera size={16} />
                  </label>

                  <input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} hidden/>
                </>
              )}

            </div>


            <div className="profile-basic">

              <h2>
                {user?.name || "User"}
              </h2>

              <p>
                @{user?.username || "username"}
              </p>

              <span>
                Active Member
              </span>

            </div>

          </div>

          <div className="profile-border"></div>


          <div className="profile-details">

            <div className="profile-details-header">

              <div>
                <span>
                  ACCOUNT INFORMATION
                </span>

                <h3>
                  Personal Details
                </h3>
              </div>

              {!editMode && (
                <button className="profile-edit" onClick={handleEdit}>
                  <Pencil size={15} />
                  Edit Profile
                </button>
              )}

            </div>

            <form onSubmit={handleSave}>

              <div className="profile-grid">


                <div className="profile-input-group">

                  <label>
                    Username
                  </label>

                  <div className="profile-input">

                    <User size={17} />

                    <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={!editMode}  required/>

                  </div>

                </div>

                <div className="profile-input-group">

                  <label>
                    Full Name
                  </label>

                  <div className="profile-input">

                    <User size={17} />

                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editMode} required />

                  </div>

                </div>

                <div className="profile-input-group profile-full">

                  <label>
                    Email Address
                  </label>

                  <div className="profile-input">

                    <Mail size={17} />

                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editMode} required />

                  </div>

                </div>

              </div>


              {editMode && (
                <div className="profile-actions">

                  <button type="button" className="profile-cancel" onClick={handleCancel}>
                    <X size={15} />
                    Cancel
                  </button>

                  <button type="submit" className="profile-save" >
                    <Save size={15} />
                    Save Changes
                  </button>

                </div>
              )}

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserProfile;

