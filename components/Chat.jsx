import PropTypes from 'prop-types';

const Chat = ({ isChatOpen, setIsChatOpen, messages, inputValue, setInputValue, isLoading, sendQuestion, handleKeyPress, chatRef }) => {
  return (
    <div
      className={`fixed bottom-4 left-4 bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isChatOpen ? 'w-80 h-96' : 'w-14 h-14'
      }`}
    >
      <button
        data-testid="chat-toggle"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="absolute top-2 right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md z-10"
      >
        {isChatOpen ? '×' : '💬'}
      </button>
      {isChatOpen && (
        <div className="p-4 h-full flex flex-col">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 pr-8">AI Assistant</h3>
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto border border-gray-200 rounded p-2 mb-2 bg-gray-50 text-xs"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                <span className="font-semibold">{msg.sender === 'user' ? 'You: ' : 'AI: '}</span>
                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }} />
              </div>
            ))}
            {isLoading && (
              <div className="mb-2 text-green-600">
                <span className="font-semibold">AI: </span>
                <img
                  src="thinking.gif"
                  alt="Thinking animation"
                  className="thinking-animation"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              data-testid="chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              data-testid="chat-send"
              onClick={sendQuestion}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded text-xs transition-colors duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Chat.propTypes = {
  isChatOpen: PropTypes.bool.isRequired,
  setIsChatOpen: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  sendQuestion: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  chatRef: PropTypes.object.isRequired,
};

export default Chat;
