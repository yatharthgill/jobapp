import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
const FiX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FiLoader = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

const AiOutlineDelete = ({ size = 22 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// A reusable input field component for consistency
const InputField = ({ label, name, value, onChange, ...props }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-600 mb-1"
    >
      {label}
    </label>
    <motion.input
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      {...props}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="mb-4 last:mb-0 p-4 hover:shadow-lg transition-shadow w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

// A reusable textarea component
const TextareaField = ({ label, name, value, onChange, ...props }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-600 mb-1"
    >
      {label}
    </label>
    <motion.textarea
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      rows="4"
      {...props}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="mb-4 last:mb-0 p-4 hover:shadow-lg transition-shadow w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update form data when the profile prop changes
    setFormData(profile);
  }, [profile]);

  // Handles changes for simple input fields (e.g., first_name, email, bio)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generic handler for adding an item to an array (e.g., skills, languages)
  const handleAddArrayItem = (field, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }));
  };

  // Generic handler for removing an item from an array by index
  const handleRemoveArrayItem = (field, index) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[field] || [])];
      updatedArray.splice(index, 1);
      return { ...prev, [field]: updatedArray };
    });
  };

  // Generic handler for updating a simple array of strings (e.g., skills, languages)
  const handleArrayStringChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[field] || [])];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  // Generic handler for updating an array of objects (e.g., projects, education)
  const handleObjectInArrayChange = (field, index, key, value) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[field] || [])];
      updatedArray[index] = { ...updatedArray[index], [key]: value };
      return { ...prev, [field]: updatedArray };
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const savePromise = axiosInstance.put(
      "http://localhost:8000/profiles/update",
      formData
    );

    toast.promise(savePromise, {
      loading: "Saving Profile",
      success: "Profile Saved Successfully",
      error: "Could not save profile.",
    });

    const response = await savePromise;

    if (response?.data) {
      console.log("Profile updated:", response.data);
      onSave(response.data.data);
      onClose();
    }
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background backdrop-blur-xs bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl m-4"
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <FiX />
              </button>
            </div>

            {/* --- Basic & Bio Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InputField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <TextareaField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <InputField
                label="LinkedIn URL"
                name="linkedin_link"
                value={formData.linkedin_link}
                onChange={handleChange}
              />
              <InputField
                label="GitHub URL"
                name="github_link"
                value={formData.github_link}
                onChange={handleChange}
              />
            </div>

            {/* --- Education Section --- */}
            <h3 className="font-semibold text-xl mt-6 mb-3 border-t pt-4">
              Education
            </h3>
            {formData.education?.map((edu, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="mb-4 last:mb-0 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow relative"
              >
                <InputField
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleObjectInArrayChange(
                      "education",
                      i,
                      "institution",
                      e.target.value
                    )
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <InputField
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleObjectInArrayChange(
                        "education",
                        i,
                        "degree",
                        e.target.value
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("education", i)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </motion.div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddArrayItem("education", {
                  institution: "",
                  degree: "",
                  field: "",
                })
              }
              className="text-indigo-600 text-sm font-semibold hover:scale-105"
            >
              + Add Education
            </button>

            {/* --- Projects Section --- */}
            <h3 className="font-semibold text-xl mt-6 mb-3 border-t pt-4">
              Projects
            </h3>
            {formData.projects?.map((proj, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="mb-4 last:mb-0 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow relative"
              >
                <InputField
                  label="Project Name"
                  value={proj.name}
                  onChange={(e) =>
                    handleObjectInArrayChange(
                      "projects",
                      i,
                      "name",
                      e.target.value
                    )
                  }
                />
                <TextareaField
                  label="Description"
                  value={proj.description}
                  onChange={(e) =>
                    handleObjectInArrayChange(
                      "projects",
                      i,
                      "description",
                      e.target.value
                    )
                  }
                />
                <InputField
                  label="Technologies (comma-separated)"
                  value={
                    Array.isArray(proj.technologies)
                      ? proj.technologies.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    handleObjectInArrayChange(
                      "projects",
                      i,
                      "technologies",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem("projects", i)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </motion.div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddArrayItem("projects", {
                  name: "",
                  description: "",
                  technologies: [],
                })
              }
              className="text-indigo-600 text-sm font-semibold hover:scale-105"
            >
              + Add Project
            </button>

            {/* --- Skills & Languages --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <h3 className="font-semibold text-xl mt-6 mb-3 border-t pt-4">
                  Skills
                </h3>
                {formData.skills?.map((skill, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={skill}
                      onChange={(e) =>
                        handleArrayStringChange("skills", i, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("skills", i)}
                      className="text-red-500"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("skills", "")}
                  className="text-indigo-600 text-sm font-semibold hover:scale-105"
                >
                  + Add Skill
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-xl mt-6 mb-3 border-t pt-4">
                  Languages
                </h3>
                {formData.languages?.map((lang, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={lang}
                      onChange={(e) =>
                        handleArrayStringChange("languages", i, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem("languages", i)}
                      className="text-red-500"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("languages", "")}
                  className="text-indigo-600 text-sm font-semibold hover:scale-105"
                >
                  + Add Language
                </button>
              </div>
            </div>

            {/* --- Save/Cancel Buttons --- */}
            <div className="flex justify-end gap-4 mt-8 pt-4 sticky bottom-0">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="last:mb-0 p-4 border border-gray-100 shadow-md hover:shadow-lg transition-shadow relative px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="shadow-sm hover:shadow-xl transition-shadow px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold flex items-center gap-2 disabled:bg-indigo-300"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
