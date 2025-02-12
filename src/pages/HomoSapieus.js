import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Brain, Search, MessagesSquare, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginModal from '../components/AiLogin/LoginModal';

const baseURL = 'http://localhost:5001/aiapi';

const HomoSapieus = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Existing states for the chat area
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOption, setSelectedOption] = useState('HomoSapieus');
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDownloadSidebarOpen, setIsDownloadSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // New states for conversation list and the selected conversation ID
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch the conversation history when the component mounts (or when the user changes)
//   useEffect(() => {
//     if (user) {
//       const token = localStorage.getItem('token');
//       axios
//         .get(`${baseURL}/chat/history`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           // Assume response.data is an array of conversation objects.
//           // Each conversation object could have the structure:
//           // { id, messages: [ { role, content, createdAt, ... }, ... ] }
//           setConversations(response.data);
//         })
//         .catch((err) => console.error('Error fetching conversation history:', err));
//     }
//   }, [user]);
useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      axios
        .get(`/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Assume response.data is an array of conversation objects.
          // Each conversation object could have the structure:
          // { id, messages: [ { role, content, createdAt, ... }, ... ] }
          setConversations(response.data);
        })
        .catch((err) => console.error('Error fetching conversation history:', err));
    }
  }, [user]);

  // Function to start a new conversation
  const handleNewConversation = () => {
    setSelectedConversation(null);
    setMessages([]); // Clear the chat area for a new conversation
  };

  // When a conversation is clicked, load its messages into the chat area.
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation.id);
    // Here we assume that the conversation object has a "messages" field.
    setMessages(conversation.messages);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
    //   const response = await axios.post(`${baseURL}/documents/upload`, formData, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    const response = await axios.post(`/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.data?.status === 200) {
        setIsDocsModalOpen(false);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Append the new user message to the chat area
    setMessages((prev) => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoginModalOpen(true);
        return;
      }

    //   const response = await axios.post(
    //     `${baseURL}/chat/message`,
    //     { message: inputValue },
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    const response = await axios.post(
        `/api/chat/message`,
        { message: inputValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Append the assistant's reply
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const options = [
    { name: 'HomoSapieus', icon: Brain },
    { name: 'Gemini', icon: MessagesSquare },
    { name: 'Web Search', icon: Search },
    { name: 'GPT', icon: Brain },
  ];

  const gradientTextStyle = {
    fontFamily: 'postnobillscolombo-SemiBold !important',
    background: 'linear-gradient(to right, #000000, #141414, #a89e9e)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="w-full px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <button
              onClick={() => navigate('/platlas')}
              className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to PLatlas</span>
            </button>

            {/* Right side */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Docs
              </button>
              <button
                onClick={() => setIsDownloadSidebarOpen(true)}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Downloads
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {user ? user.email : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left sidebar */}
      <div
        className={`w-80 bg-white border-r border-gray-200 flex flex-col h-full transition-transform duration-300 ease-in-out fixed mt-16 ${
          'translate-x-0'
        }`}
      >
        {/* Company Title & Menu */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-7 h-7 text-gray-800" />
              <span className="text-xl font-semibold font-montserrat-alt" style={gradientTextStyle}>
                HOMOSAPIEUS
              </span>
            </div>
            {/* <button
              onClick={() => {}}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-800" />
            </button> */}
          </div>
          {/* New Conversation Button */}
          <button
            onClick={handleNewConversation}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-gray-700 transition-all shadow-sm"
          >
            <MessagesSquare className="w-4 h-4" />
            <span className="font-medium">New Conversation</span>
          </button>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recent Conversations
            </h3>
          </div>
          <div className="space-y-0.5">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    selectedConversation === conversation.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Show a snippet of the conversation.
                      For example, use the beginning of the first user message or a timestamp. */}
                  {conversation.messages && conversation.messages.length > 0
                    ? conversation.messages[0].content.substring(0, 20) + '...'
                    : 'Conversation'}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">No conversations found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Document Button & Modal */}
      <div>
        <button onClick={() => setIsDocsModalOpen(true)}>Upload Document</button>
        {isDocsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleFileUpload} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Upload
              </button>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="mt-4 bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Download Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isDownloadSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Downloads</h2>
            <button
              onClick={() => setIsDownloadSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">HomoSapieus Desktop App</h3>
              <p className="text-sm text-gray-600 mb-3">Version 1.0.0</p>
              <button className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors">
                Download for Windows
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Mobile App</h3>
              <p className="text-sm text-gray-600 mb-3">Available on iOS and Android</p>
              <div className="space-y-2">
                <button className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors">
                  Download for iOS
                </button>
                <button className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors">
                  Download for Android
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          'ml-80'
        } mt-16`}
      >
        {/* (If you ever collapse the sidebar, you could add a toggle button here) */}

        {messages.length === 0 ? (
          // Empty state UI
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center mb-8">
                <Brain className="w-16 h-16 text-gray-800 mb-4" />
                <h1
                  className="text-4xl font-semibold mb-2 font-montserrat-alt"
                  style={gradientTextStyle}
                >
                  HI, I'M HOMOSAPIEUS
                </h1>
                <p className="text-xl text-gray-800">How can I help you today?</p>
              </div>

              <div className="w-full max-w-4xl px-6">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="rounded-3xl bg-white shadow-sm">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Message HomoSapieus"
                      className="w-full px-6 py-4 bg-transparent focus:outline-none rounded-3xl border-0 ring-0 focus:ring-0"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`absolute right-4 top-4 transition-transform hover:scale-105 ${
                        !inputValue.trim() ? 'opacity-100' : ''
                      }`}
                    >
                      <div className="bg-gray-800 rounded-full p-2">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                    </button>

                    <div className="flex items-center gap-3 px-6 pb-4">
                      {options.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setSelectedOption(option.name)}
                          className={`flex items-center gap-2 text-sm transition-all rounded-full px-3 py-1 ${
                            selectedOption === option.name
                              ? 'bg-gray-800 bg-opacity-20 text-gray-800'
                              : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          <option.icon className="w-4 h-4" />
                          <span>{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat messages UI */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto pt-6">
                {messages.map((message, index) => (
                  <div key={index} className="mb-6 px-6">
                    <div
                      className={`flex gap-4 max-w-3xl ${
                        message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          message.role === 'assistant'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {message.role === 'assistant' ? 'HS' : 'Y'}
                      </div>
                      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`inline-block whitespace-pre-wrap break-words max-w-full rounded-2xl px-4 py-2 shadow-sm ${
                            message.role === 'assistant'
                              ? 'bg-white text-gray-800'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="px-6 mb-6">
                    <div className="flex gap-4 max-w-3xl">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm">
                        HS
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-2 shadow-sm flex items-center">
                        <div className="flex gap-1">
                          <span
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          />
                          <span
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: '200ms' }}
                          />
                          <span
                            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: '400ms' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat input form */}
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="rounded-3xl bg-white shadow-sm">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Message HomoSapieus"
                      className="w-full px-6 py-4 bg-transparent focus:outline-none rounded-3xl border-0 ring-0 focus:ring-0"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`absolute right-4 top-4 transition-transform hover:scale-105 ${
                        !inputValue.trim() ? 'opacity-100' : ''
                      }`}
                    >
                      <div className="bg-gray-800 rounded-full p-2">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                    </button>

                    <div className="flex items-center gap-3 px-6 pb-4">
                      {options.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setSelectedOption(option.name)}
                          className={`flex items-center gap-2 text-sm transition-all rounded-full px-3 py-1 ${
                            selectedOption === option.name
                              ? 'bg-gray-800 bg-opacity-20 text-gray-800'
                              : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          <option.icon className="w-4 h-4" />
                          <span>{option.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default HomoSapieus;
