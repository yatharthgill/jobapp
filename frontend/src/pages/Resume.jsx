// Resume.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import { FileUpload } from "@/components/ui/file-upload";

const Resume = ({ onUploadSuccess }) => {
  const [response, setResponse] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;

  const handleFileUpload = async (selectedFiles) => {
    try {
      const file = Array.isArray(selectedFiles)
        ? selectedFiles[0]
        : selectedFiles;

      if (!file) return;

      // 🔹 Prevent re-upload of the same file
      if (
        uploadedFile &&
        uploadedFile.name === file.name &&
        uploadedFile.size === file.size
      ) {
        console.log("File already uploaded, skipping...");
        return;
      }

      console.log("Uploading file:", file);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post(`${API}/resume/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const parse_res = await axiosInstance.post(`${API}/resume/parse`);
      const profile = await axiosInstance.post(`${API}/profiles/create`);

      console.log("Upload response:", res.data);
      console.log("Resume Parsed", parse_res.data);
      console.log("Profile Created Successfully", profile.data);

      // Save uploaded file reference
      setUploadedFile(file);

      // refresh data after upload
      fetchdata();

      // ✅ Close the dialog after success
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error);
    }
  };

  const fetchdata = async () => {
    try {
      const res = await axiosInstance.get(`${API}/resume/resumes`);
      console.log(res.data);

      if (!res.data?.data || res.data.data.length === 0) {
        setResponse(""); // no resume found
      } else {
        setResponse(res.data.data.profile); // adjust based on API shape
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("Error fetching data");
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      {response === "" ? (
        <>
          <h1>Please upload your resume. You have not uploaded it yet.</h1>
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white border-neutral-200 rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </>
      ) : response ? (
        <div className="container mx-auto">
          <h2>Your Resume Data</h2>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Resume;
