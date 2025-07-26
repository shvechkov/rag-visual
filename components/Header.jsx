import PropTypes from 'prop-types';

const Header = ({ activeMenuItem, handleMenuClick }) => {
  return (
    <header className="bg-white shadow-md border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 mr-8">Our Store</h1>
            <nav className="flex space-x-6">
              <button
                data-testid="menu-categories"
                onClick={() => handleMenuClick('Categories')}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeMenuItem === 'Categories' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Categories
              </button>
              <button
                data-testid="menu-stories"
                onClick={() => handleMenuClick('Stories')}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeMenuItem === 'Stories' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Stories
              </button>
              <button
                data-testid="menu-misc"
                onClick={() => handleMenuClick('Misc')}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeMenuItem === 'Misc' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Misc
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  activeMenuItem: PropTypes.string.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
};

export default Header;
