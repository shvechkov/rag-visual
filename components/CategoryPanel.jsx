import PropTypes from 'prop-types';

const CategoryPanel = ({ selectedCategory, handleButtonClick }) => {
  return (
    <div className="w-1/3 bg-white shadow-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
      <button
        data-testid="category-cats"
        onClick={() => handleButtonClick('cats')}
        className={`font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md ${
          selectedCategory === 'cats' ? 'bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Cats
      </button>
      <button
        data-testid="category-dogs"
        onClick={() => handleButtonClick('dogs')}
        className={`font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md ${
          selectedCategory === 'dogs' ? 'bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        Dogs
      </button>
      <button
        data-testid="category-flowers"
        onClick={() => handleButtonClick('flowers')}
        className={`font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md ${
          selectedCategory === 'flowers' ? 'bg-purple-600 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
        }`}
      >
        Flowers
      </button>
    </div>
  );
};

CategoryPanel.propTypes = {
  selectedCategory: PropTypes.string,
  handleButtonClick: PropTypes.func.isRequired,
};

export default CategoryPanel;
