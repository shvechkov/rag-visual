import PropTypes from 'prop-types';

const OrderModal = ({ modalContent, handleCloseModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
        <div className="text-gray-600 mb-6 space-y-2">
          <p><span className="font-semibold">Item:</span> {modalContent.item}</p>
          <p><span className="font-semibold">Quantity:</span> {modalContent.quantity}</p>
          <p><span className="font-semibold">Unit Price:</span> {modalContent.unitPrice}</p>
          <p><span className="font-semibold">Total:</span> ${modalContent.total}</p>
        </div>
        <button
          data-testid="modal-close"
          onClick={handleCloseModal}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

OrderModal.propTypes = {
  modalContent: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

export default OrderModal;
