import { useEffect, useState } from "react";
import { Github, Linkedin, FileUser, Code } from "lucide-react";

const DeveloperInfo = () => {
  const [profileData, setProfileData] = useState({
    name: "Dheeraj Baheti",
    role: "Full Stack Developer",
    github: "https://github.com/DheerajBaheti06",
    linkedin: "https://www.linkedin.com/in/dheeraj-baheti1",
    resume:
      "https://drive.google.com/file/d/1LGdqrdugh_ZtLSGsWLY9UugJcbT35LbO/view?usp=drive_link",
    sourceCode:
      "https://github.com/DheerajBaheti06/react-projects/tree/main/currency-converter",
  });

  useEffect(() => {
    fetch("https://profile-api-theta.vercel.app/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.links) {
          setProfileData((prev) => ({
            ...prev,
            github: data.links.github || prev.github,
            linkedin: data.links.linkedin || prev.linkedin,
            resume: data.links.resume || prev.resume,
            sourceCode: data.links.sourceCode || prev.sourceCode,
          }));
        }
      })
      .catch((err) => console.log("Profile fetch failed:", err));
  }, []);

  const { name, role, github, linkedin, resume, sourceCode } = profileData;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-1.5 bg-slate-800/95 backdrop-blur-md px-3 py-2 rounded-full border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/90 group">
        <div className="hidden sm:flex flex-col">
          <span className="text-xs text-slate-300 font-medium leading-tight">
            Built by {name.split(" ")[0]}
          </span>
          <span className="text-[12px] text-slate-400 leading-tight">
            {role}
          </span>
        </div>

        {/* Social Links */}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
            title={`${name} on GitHub`}
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 hover:scale-110"
            title={`Connect with ${name} on LinkedIn`}
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}

        {resume && (
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-all duration-200 hover:scale-110"
            title={`View ${name}'s Resume`}
          >
            <FileUser className="w-3.5 h-3.5" />
          </a>
        )}

        {sourceCode && (
          <a
            href={sourceCode}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-green-600 hover:bg-green-500 text-white transition-all duration-200 hover:scale-110"
            title="View Source Code"
          >
            <Code className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default DeveloperInfo;
