const Stories = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Stories</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Stories</h2>
          <p className="text-gray-600 mb-4">"I love the cats from this store! They're so friendly and well-cared for. My family couldn't be happier with our new furry friend."</p>
          <p className="text-sm text-gray-500 mb-6">- Sarah M.</p>
          <p className="text-gray-600 mb-4">"The flowers I ordered for my wedding were absolutely stunning. The quality exceeded my expectations and the delivery was perfect."</p>
          <p className="text-sm text-gray-500 mb-6">- Michael & Jennifer</p>
          <p className="text-gray-600 mb-4">"My dog absolutely loves the toys and treats from here. Great quality products and excellent customer service!"</p>
          <p className="text-sm text-gray-500">- David L.</p>
        </div>
      </div>
    </div>
  );
};

export default Stories;
