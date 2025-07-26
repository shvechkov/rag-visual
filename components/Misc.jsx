const Misc = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Miscellaneous</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Additional Information</h2>
          <div className="text-left space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Store Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9AM - 8PM</p>
              <p className="text-gray-600">Saturday - Sunday: 10AM - 6PM</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Information</h3>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
              <p className="text-gray-600">Email: info@ourstore.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Shipping & Returns</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Misc;
