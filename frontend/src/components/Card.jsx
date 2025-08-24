import React, { useRef, useEffect } from 'react';

// --- HELPER COMPONENTS ---

// Location Pin Icon
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 flex-shrink-0">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CompanyLogo = ({ company }) => (
    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
        <span className="text-xl font-bold text-gray-600">{company.charAt(0)}</span>
    </div>
);

// --- JOB CARD COMPONENT ---
const Card = ({ source, url, title, company, location, salary, published }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e) => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = ((y / height) - 0.5) * -16;
      const rotateY = ((x / width) - 0.5) * 16;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const sourceInfo = {
    linkedin: { text: 'LinkedIn', bg: 'bg-blue-100', textColor: 'text-blue-800' },
    indeed: { text: 'Indeed', bg: 'bg-green-100', textColor: 'text-green-800' }
  };
  const currentSource = sourceInfo[source.toLowerCase()] || { text: source.charAt(0).toUpperCase() + source.slice(1).toLowerCase(), bg: 'bg-gray-100', textColor: 'text-gray-800' };

  return (
    <div ref={cardRef} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 ease-out will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_50%,rgba(96,165,250,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <CompanyLogo company={company} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <p className="text-gray-600 font-medium">{company}</p>
            </div>
          </div>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${currentSource.bg} ${currentSource.textColor}`}>{currentSource.text}</span>
        </div>
        <div className="flex-grow space-y-3 mb-4">
          {salary && <p className="text-sm text-green-600 font-semibold">{salary}</p>}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <LocationIcon />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {published && <p className="text-xs text-gray-400">Posted: {new Date(published).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>}
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white px-4 py-2 opacity-100 translate-y-0 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Apply Now</a>
        </div>
      </div>
    </div>
  );
};


export default Card
