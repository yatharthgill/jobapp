import { BentoGrid, BentoGridItem } from "./ui/bento-grid";

const bentoGridItems = [
  {
    title: "AI-Powered Job Matching",
    description:
      "Our advanced AI finds the perfect job for you based on your skills and experience.",
    header: (
      <div className="bg-blue-100  p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 ">Smart Search</h3>
      </div>
    ),
    className: "md:col-span-2",
  },
  {
    title: "Instant Resume Analysis",
    description:
      "Get immediate feedback on your resume to improve your chances of getting hired.",
    header: (
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 ">Resume Scan</h3>
      </div>
    ),
    className: "md:col-span-1",
  },
  {
    title: "Track Your Applications",
    description: "Keep track of all your job applications in one place.",
    header: (
      <div className="bg-yellow-100  p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 ">
          Application Hub
        </h3>
      </div>
    ),
    className: "md:col-span-1",
  },
  {
    title: "Personalized Career Insights",
    description: "Receive personalized insights to guide your career path.",
    header: (
      <div className="bg-purple-100  p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800">
          Career Guidance
        </h3>
      </div>
    ),
    className: "md:col-span-2",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything You Need for Your Job Search
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A powerful suite of tools to help you succeed.
          </p>
        </div>
        <div className="mt-12">
          <BentoGrid className="max-w-4xl mx-auto">
            {bentoGridItems.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                className={item.className}
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection