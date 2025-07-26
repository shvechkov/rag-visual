import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import CategoryPanel from './CategoryPanel';
import CategoryDetails from './CategoryDetails';
import Stories from './Stories';
import Misc from './Misc';
import OrderModal from './OrderModal';
import Chat from './Chat';
import ActionHandler from './ActionHandler';

// Category data
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

export default function ButtonPanelApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantities, setQuantities] = useState({ cats: 0, dogs: 0, flowers: 0 });
  const [activeMenuItem, setActiveMenuItem] = useState('Categories');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi, I'm your AI assistant ready to help with any questions!", sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const chatRef = useRef(null);
  const sessionIdRef = useRef(null);
  const threadIdRef = useRef(null);
  const wandRef = useRef(null);

  // Initialize wand cursor
  useEffect(() => {
    if (!wandRef.current) {
      const wand = document.createElement('div');
      wand.className = 'wand-cursor';
      const img = document.createElement('img');
      img.src = '/pointinghand.png';
      img.alt = 'finger cursor';
      img.style.width = '32px';
      img.style.height = '32px';
      wand.appendChild(img);
      document.body.appendChild(wand);
      wandRef.current = wand;
      wandRef.current.style.display = 'none';
      console.debug('[ButtonPanelApp] Wand cursor initialized with bitmap');
    }
    return () => {
      if (wandRef.current) {
        document.body.removeChild(wandRef.current);
        console.debug('[ButtonPanelApp] Wand cursor removed');
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      console.debug('[ButtonPanelApp] Auto-scrolling chat to bottom');
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMenuClick = (menuItem) => {
    console.debug(`[ButtonPanelApp] Menu click: ${menuItem}`);
    setActiveMenuItem(menuItem);
    if (menuItem === 'Categories') {
      setSelectedCategory(null);
    }
  };

  const handleButtonClick = (category) => {
    console.debug(`[ButtonPanelApp] Button click: ${category}`);
    setSelectedCategory(category);
  };

  const handleQuantityChange = (category, value) => {
    console.debug(`[ButtonPanelApp] Quantity change for ${category}: ${value}`);
    const numValue = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => ({
      ...prev,
      [category]: numValue,
    }));
  };

  const handleAddItem = (category) => {
    console.debug(`[ButtonPanelApp] Add item: ${category}`);
    setQuantities((prev) => ({
      ...prev,
      [category]: prev[category] + 1,
    }));
  };

  const handlePlaceOrder = (category) => {
    console.debug(`[ButtonPanelApp] Place order for ${category}`);
    const categoryData = CATEGORIES[category];
    const quantity = quantities[category];
    const total = (parseFloat(categoryData.price.replace('$', '')) * quantity).toFixed(2);

    setModalContent({
      item: categoryData.name,
      quantity,
      unitPrice: categoryData.price,
      total,
    });
    setIsModalOpen(true);

    setMessages((prev) => [
      ...prev,
      { text: `Order placed: ${quantity} ${categoryData.name} for $${total}`, sender: 'bot' },
    ]);
  };

  const handleCloseModal = () => {
    console.debug('[ButtonPanelApp] Closing order confirmation modal');
    setIsModalOpen(false);
    setModalContent(null);
    setActiveMenuItem('Categories');
    setSelectedCategory(null);
    console.debug('[ButtonPanelApp] Navigated to Categories view');
  };

  const sendQuestion = async () => {
    const question = inputValue.trim();
    if (!question || isLoading) {
      console.debug(`[ButtonPanelApp] Send question blocked: ${!question ? 'Empty question' : 'Loading state'}`);
      return;
    }

    console.debug(`[ButtonPanelApp] Sending question: "${question}"`);
    setMessages((prev) => [...prev, { text: question, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.debug('[ButtonPanelApp] Making API call to /api/chat');
      const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionIdRef.current ? { 'x-session-id': sessionIdRef.current } : {}),
          ...(threadIdRef.current ? { 'x-thread-id': threadIdRef.current } : {}),
        },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        console.error(`[ButtonPanelApp] API call failed: ${response.status}`);
        throw new Error(await response.text());
      }

      const data = await response.json();
      let reply = data.reply;
      console.debug(`[ButtonPanelApp] Received API reply: ${reply}`);

      const actionMatch = reply.match(/<action>([\s\S]*?)<\/action>/);
      if (actionMatch) {
        const actionContent = actionMatch[1];
        console.debug(`[ButtonPanelApp] Found action tag with content: ${actionContent}`);
        try {
          const actionObj = JSON.parse(actionContent);
          const steps = actionObj.steps;

          if (Array.isArray(steps) && steps.length > 0) {
            console.debug(`[ButtonPanelApp] Processing ${steps.length} action steps: ${JSON.stringify(steps)}`);
            reply = reply.replace(/<action>([\s\S]*?)<\/action>/, 'Let me guide you through the steps...');
            const enhancedSteps = [];
            for (const step of steps) {
              const text = typeof step === 'string' ? step : step.text;
              enhancedSteps.push({ action: 'move', text });
              enhancedSteps.push({ action: 'highlight', text });
              enhancedSteps.push({ action: 'click', text });
            }
            await ActionHandler.processActions(enhancedSteps, setMessages, ActionHandler.config.defaultStepDelay, wandRef);
          } else {
            console.warn('[ButtonPanelApp] No valid steps in action object');
            setMessages((prev) => [
              ...prev,
              { text: 'No valid actions provided. Please try again.', sender: 'bot' },
            ]);
          }
        } catch (err) {
          console.error(`[ActionHandler] Failed to parse action JSON: ${err.message}`);
          setMessages((prev) => [
            ...prev,
            { text: 'Failed to process actions. Please try again.', sender: 'bot' },
          ]);
        }
      }

      setMessages((prev) => [...prev, { text: reply, sender: 'bot' }]);
      console.debug('[ButtonPanelApp] Added bot reply to messages');

      if (data.session_id) {
        console.debug(`[ButtonPanelApp] Updated session ID: ${data.session_id}`);
        sessionIdRef.current = data.session_id;
      }
      if (data.thread_id) {
        console.debug(`[ButtonPanelApp] Updated thread ID: ${data.thread_id}`);
        threadIdRef.current = data.thread_id;
      }
    } catch (err) {
      console.error(`[ButtonPanelApp] Error in sendQuestion: ${err.message}`);
      setMessages((prev) => [
        ...prev,
        { text: '[Error: Could not contact backend]', sender: 'bot' },
      ]);
    } finally {
      console.debug('[ButtonPanelApp] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.debug('[ButtonPanelApp] Enter key pressed, triggering sendQuestion');
      sendQuestion();
    }
  };

  const renderContent = () => {
    console.debug(`[ButtonPanelApp] Rendering content for activeMenuItem: ${activeMenuItem}`);
    switch (activeMenuItem) {
      case 'Categories':
        return (
          <div className="flex h-full">
            <CategoryPanel selectedCategory={selectedCategory} handleButtonClick={handleButtonClick} />
            <CategoryDetails
              selectedCategory={selectedCategory}
              quantities={quantities}
              handleQuantityChange={handleQuantityChange}
              handleAddItem={handleAddItem}
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        );
      case 'Stories':
        return <Stories />;
      case 'Misc':
        return <Misc />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <style>
        {`
          body {
            overflow: hidden;
          }
          .wand-cursor {
            position: fixed;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            transition: all 1s ease-in-out;
            z-index: 1000;
          }
          .wand-cursor img {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
          .thinking-animation {
            display: inline-block;
            width: 24px;
            height: auto;
            vertical-align: middle;
          }
        `}
      </style>
      <Header activeMenuItem={activeMenuItem} handleMenuClick={handleMenuClick} />
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
        {isModalOpen && modalContent && (
          <OrderModal modalContent={modalContent} handleCloseModal={handleCloseModal} />
        )}
      </main>
      <Chat
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        sendQuestion={sendQuestion}
        handleKeyPress={handleKeyPress}
        chatRef={chatRef}
      />
    </div>
  );
}
