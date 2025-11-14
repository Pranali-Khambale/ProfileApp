import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  Loader,
} from "lucide-react";
import { profileAPI } from "../services/api";

const ProfileManagement = ({ openAddModal, setOpenAddModal }) => {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    description: "",
    address: "",
    lat: "",
    lng: "",
    email: "",
    phone: "",
    interests: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProfiles();
  }, []);


  useEffect(() => {
    if (openAddModal) {
      console.log("Opening modal from Dashboard");
      setShowModal(true);
      setEditingProfile(null);
      resetForm();
      if (setOpenAddModal) {
        setOpenAddModal(false); 
      }
    }
  }, [openAddModal, setOpenAddModal]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await profileAPI.getAllProfiles();
      if (response.success) {
        setProfiles(response.data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      alert(
        " Failed to load profiles"
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.lat || isNaN(formData.lat))
      errors.lat = "Valid latitude required";
    if (!formData.lng || isNaN(formData.lng))
      errors.lng = "Valid longitude required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

   
    const profileData = {
      name: formData.name.trim(),
      photo:
        formData.photo.trim() ||
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
      description: formData.description.trim(),
      address: formData.address.trim(),
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      interests: formData.interests
        ? formData.interests
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [],
    };

    console.log("Submitting profile data:", profileData);

    try {
      if (editingProfile) {
        const response = await profileAPI.updateProfile(
          editingProfile.id,
          profileData
        );
        if (response.success) {
          alert("Profile updated successfully!");
          await fetchProfiles();
          resetForm();
          
          window.dispatchEvent(new CustomEvent("profileUpdated"));
        }
      } else {
        const response = await profileAPI.createProfile(profileData);
        if (response.success) {
          alert(" Profile created successfully!");
          await fetchProfiles();
          resetForm();
          
          window.dispatchEvent(new CustomEvent("profileUpdated"));
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      console.error("Error details:", error.response?.data);
      alert(
        ` Failed to save profile\n\n${error.message}\n\nPlease check:\n1. Backend server is running\n2. All required fields are filled correctly`
      );
    }
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      photo: profile.photo,
      description: profile.description,
      address: profile.address,
      lat: profile.lat.toString(),
      lng: profile.lng.toString(),
      email: profile.email,
      phone: profile.phone,
      interests: profile.interests.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        const response = await profileAPI.deleteProfile(id);
        if (response.success) {
          alert(" Profile deleted successfully!");
          await fetchProfiles();
         
          window.dispatchEvent(new CustomEvent("profileUpdated"));
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        alert("Failed to delete profile");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      photo: "",
      description: "",
      address: "",
      lat: "",
      lng: "",
      email: "",
      phone: "",
      interests: "",
    });
    setFormErrors({});
    setEditingProfile(null);
    setShowModal(false);
  };

  const handleAddProfileClick = () => {
    console.log("Add Profile button clicked in ProfileManagement");
    setShowModal(true);
    setEditingProfile(null);
   
    setFormData({
      name: "",
      photo: "",
      description: "",
      address: "",
      lat: "",
      lng: "",
      email: "",
      phone: "",
      interests: "",
    });
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        
        <button
          onClick={handleAddProfileClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Add Profile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Profiles</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {profiles.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {profiles.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Locations</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {profiles.length}
          </p>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Profiles Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first profile
            </p>
            <button
              onClick={handleAddProfileClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Profile
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr
                  key={profile.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {profile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {profile.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {profile.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="truncate max-w-xs">
                        {profile.address}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(profile)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProfile ? "Edit Profile" : "Add New Profile"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    rows="3"
                    placeholder="Brief description about the person"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Full address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    value={formData.lat}
                    onChange={(e) =>
                      setFormData({ ...formData, lat: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.lat ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., 37.4220"
                  />
                  {formErrors.lat && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.lat}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    value={formData.lng}
                    onChange={(e) =>
                      setFormData({ ...formData, lng: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.lng ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., -122.0841"
                  />
                  {formErrors.lng && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.lng}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="email@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) =>
                      setFormData({ ...formData, interests: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Coding, Travel, Music"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingProfile ? "Update Profile" : "Create Profile"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
