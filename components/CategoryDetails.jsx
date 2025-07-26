import PropTypes from 'prop-types';

const CATEGORIES = {
  cats: {
    name: 'Cats',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    description: 'Adorable feline companions',
    price: '$25.00',
  },
  dogs: {
    name: 'Dogs',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    description: 'Loyal canine friends',
    price: '$30.00',
  },
  flowers: {
    name: 'Flowers',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    description: 'Beautiful fresh blooms',
    price: '$15.00',
  },
};

const CategoryDetails = ({ selectedCategory, quantities, handleQuantityChange, handleAddItem, handlePlaceOrder }) => {
  return (
    <div className="w-2/3 p-6">
      <div className="bg-white rounded-lg shadow-lg h-full flex items-center justify-center">
        {selectedCategory ? (
          <div className="text-center max-w-md w-full">
            <div className="mb-6">
              <img
                src={CATEGORIES[selectedCategory].image}
                alt={CATEGORIES[selectedCategory].name}
                className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
              />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{CATEGORIES[selectedCategory].name}</h1>
              <p className="text-gray-600 text-lg mb-2">{CATEGORIES[selectedCategory].description}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">{CATEGORIES[selectedCategory].price}</p>
            </div>
            <div className="mb-6">
              <label
                htmlFor={`quantity-${selectedCategory}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity
              </label>
              <div className="flex items-center justify-center gap-3">
                <input
                  id={`quantity-${selectedCategory}`}
                  type="number"
                  min="0"
                  value={quantities[selectedCategory]}
                  onChange={(e) => handleQuantityChange(selectedCategory, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
                <button
                  data-testid="add-item"
                  onClick={() => handleAddItem(selectedCategory)}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-md"
                >
                  Add Item
                </button>
              </div>
            </div>
            <button
              data-testid="place-order"
              onClick={() => handlePlaceOrder(selectedCategory)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md text-lg"
            >
              Place Order
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Store</h1>
            <p className="text-gray-600 text-lg">Select a category from the left to view products</p>
          </div>
        )}
      </div>
    </div>
  );
};

CategoryDetails.propTypes = {
  selectedCategory: PropTypes.string,
  quantities: PropTypes.object.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  handlePlaceOrder: PropTypes.func.isRequired,
};

export default CategoryDetails;
