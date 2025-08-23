import { Link } from "react-router-dom";
import { BackgroundBeams } from "./ui/background-beams";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const HeroSection = () => {
  return (
    <section className="relative text-center">
      {/* Background */}
      <BackgroundBeams />

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center h-[30rem]">
          <TextGenerateEffect words="Find Your Dream Job with the Power of AI" />

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Our intelligent platform helps you discover the perfect job and
            optimize your resume to stand out from the crowd.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/jobs"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 cursor-pointer"
            >
              Find a Job
            </Link>

            <Link
              to="/resume"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 cursor-pointer"
            >
              Analyze Resume
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
