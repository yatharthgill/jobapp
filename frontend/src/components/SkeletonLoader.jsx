export const SkeletonLoader = () => (
  <div className="max-w-5xl mx-auto p-8 animate-pulse">
    <div className="flex items-center space-x-6 bg-gray-200 p-6 rounded-2xl">
      <div className="w-32 h-32 rounded-full bg-gray-300"></div>
      <div className="flex-1 space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-200 p-6 rounded-2xl h-64"></div>
        <div className="bg-gray-200 p-6 rounded-2xl h-40"></div>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-200 p-6 rounded-2xl h-48"></div>
        <div className="bg-gray-200 p-6 rounded-2xl h-48"></div>
      </div>
    </div>
  </div>
);