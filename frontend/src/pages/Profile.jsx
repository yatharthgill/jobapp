import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiLinkedin,
  FiGithub,
  FiAward,
  FiBookOpen,
  FiCode,
  FiTool,
  FiBriefcase,
  FiEdit,
  FiMapPin,
  FiFolder, // Added new icon for Projects
} from "react-icons/fi";
import { motion } from "framer-motion";
import axiosInstance from "@/axiosInstance";
import { EditProfileModal } from "@/components/EditProfileModal";
import { SkeletonLoader } from "@/components/SkeletonLoader";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Resume from "./Resume";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8000/profiles/me"
      );
      if (!response) {
        throw new Error("Network response was not ok");
      }
      const result = await response.data;
      setProfile(result.data);
      console.log(result.data.skills);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) return <SkeletonLoader />;
  if (!profile)
    return (
      <div>
        {!open && (
          <p>No profile data found. Upload resume to create profile!</p>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Upload Resume</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Resume
              onUploadSuccess={() => {
                setOpen(false);
                fetchProfileData();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    );

  const githubInfo = profile.github_analysis?.[0];

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-r from-gray-50 via-gray-200 to-gray-400" />

      <main className="relative max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative"
        >
          <img
            src={profile.profile_picture || githubInfo?.avatar_url}
            alt={`${profile.first_name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-600 mt-2 whitespace-pre-line">
              {profile?.bio || githubInfo?.bio}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 mt-4 text-gray-500">
              <InfoLink
                icon={<FiMail />}
                href={`mailto:${profile.email}`}
                text={profile.email}
              />
              <InfoLink
                icon={<FiPhone />}
                href={`tel:${profile.phone_number}`}
                text={profile.phone_number}
              />
              <InfoLink
                icon={<FiLinkedin />}
                href={`https://${profile.linkedin_link}`}
                text="LinkedIn"
              />
              <InfoLink
                icon={<FiGithub />}
                href={profile.github_link}
                text="GitHub"
              />
              {githubInfo && (
                <InfoLink
                  icon={<FiMapPin />}
                  text={githubInfo?.location}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    githubInfo.location
                  )}`}
                />
              )}
            </div>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-600 hover:bg-gray-200 hover:text-indigo-600 transition-all duration-300"
          >
            <FiEdit size={20} />
          </button>
        </motion.header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {/* --- NEW SECTION ADDED HERE --- */}
            <Section icon={<FiBriefcase />} title="Experience">
              {profile.experience?.map((exp, index) => (
                <ExperienceCard key={index} experience={exp} />
              ))}
            </Section>

            {/* --- PROJECTS SECTION (ICON UPDATED) --- */}
            <Section icon={<FiFolder />} title="Projects">
              {profile.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </Section>

            <Section icon={<FiBookOpen />} title="Education">
              {profile.education.map((edu, index) => (
                <EducationCard key={index} edu={edu} />
              ))}
            </Section>
          </div>
          <div className="space-y-6">
            <Section icon={<FiTool />} title="Skills">
              <div className="flex flex-wrap gap-2">
                {profile.skills &&
                  (Array.isArray(profile.skills)
                    ? profile.skills // case 1: plain array
                    : Object.values(profile.skills).flat()
                  ) // case 2: object of arrays
                    .map((skill) => <SkillTag key={skill} skill={skill} />)}
              </div>
            </Section>
            <Section icon={<FiAward />} title="Certifications">
              <ul className="space-y-3">
                {profile.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiAward className="mt-1 text-indigo-500 flex-shrink-0" />
                    <div>
                      <strong>{cert.name}</strong>
                      <p className="text-sm text-gray-500">{cert.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
            <Section icon={<FiCode />} title="Languages">
              <ul className="space-y-2">
                {profile.languages.map((lang) => (
                  <li
                    key={lang}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <FiCode className="text-indigo-500" />
                    {lang}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

const Section = ({ icon, title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      {icon} {title}
    </h2>
    {children}
  </motion.section>
);

// --- NEW COMPONENT FOR EXPERIENCE ---
const ExperienceCard = ({ experience }) => (
  <motion.div
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="mb-4 last:mb-0 p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
  >
    <div className="flex justify-between items-start flex-col sm:flex-row">
      <div>
        <h3 className="font-bold text-lg text-indigo-700">{experience.role}</h3>
        <p className="font-semibold text-gray-700">{experience.company}</p>
      </div>
      <div className="text-left sm:text-right flex-shrink-0 mt-2 sm:mt-0 sm:ml-4">
        <p className="text-sm text-gray-500">{experience.duration}</p>
        <p className="text-sm text-gray-500">{experience.location}</p>
      </div>
    </div>
    <p className="text-gray-600 text-sm mt-2">{experience.description}</p>
  </motion.div>
);

const ProjectCard = ({ project }) => (
  <motion.div
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="mb-4 last:mb-0 p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
  >
    <h3 className="font-bold text-lg text-indigo-700">{project.name}</h3>
    <p className="text-gray-600 text-sm my-1">{project.description}</p>
    {project.technologies && (
      <div className="flex flex-wrap gap-2 mt-3">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    )}
  </motion.div>
);

const EducationCard = ({ edu }) => (
  <div className="p-4 bg-gray-50 rounded-xl">
    <h3 className="font-bold text-gray-800">{edu.institution}</h3>
    <p className="text-sm text-gray-600">
      {edu.degree} in {edu.field}
    </p>
    <p className="text-xs text-gray-500 mt-1">
      {edu.startDate && (
        <>
          {edu.startDate}
          {edu.endDate && ` - ${edu.endDate}`}
        </>
      )}
      {(edu.cgpa || edu.sgpa || edu.percentage || edu.location) && " • "}
      {edu.cgpa && `CGPA: ${edu.cgpa}`}
      {edu.sgpa && `SGPA: ${edu.sgpa}`}
      {edu.percentage && `Percentage: ${edu.percentage}`}
      {(edu.cgpa || edu.sgpa || edu.percentage) && edu.location && " • "}
      {edu.location && edu.location}
    </p>
  </div>
);

const InfoLink = ({ icon, href, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm hover:text-indigo-600 transition-colors font-medium"
  >
    {icon} {text}
  </a>
);

const SkillTag = ({ skill }) => (
  <div className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors cursor-default">
    {skill}
  </div>
);

export default Profile;
