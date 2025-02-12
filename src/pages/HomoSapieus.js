import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Search, MessagesSquare, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
const HomoSapieus = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState('HomoSapieus');

  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDownloadSidebarOpen, setIsDownloadSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'This is a simulated genomics analysis response.'
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const options = [
    { name: 'HomoSapieus', icon: Brain },
    { name: 'Gemini', icon: MessagesSquare },
    { name: 'Web Search', icon: Search },
    { name: 'GPT', icon: Brain }
  ];

  const gradientTextStyle = {
    fontFamily: 'postnobillscolombo-SemiBold !important',
    background: 'linear-gradient(to right, #000000, #141414, #a89e9e)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
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
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left sidebar */}
      <div
        className={`w-80 bg-white border-r border-gray-200 flex flex-col h-full transition-transform duration-300 ease-in-out fixed mt-16 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Company Title & Menu */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-7 h-7 text-gray-800" />
              <span 
                className="text-xl font-semibold font-montserrat-alt"
                style={gradientTextStyle}
              >
                HOMOSAPIEUS
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          <button className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-gray-700 transition-all shadow-sm">
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
            {[1, 2, 3].map((_, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Genomics Analysis {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isDocsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Documentation</h2>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
              <p className="text-gray-600 mb-4">
                Welcome to HomoSapieus documentation. Here you'll find everything you need to know about using our platform.
              </p>
              {/* Add more documentation content */}
            </div>
          </div>
        </div>
      )}
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
          isSidebarOpen ? 'ml-80' : 'ml-0'
        } mt-16`}
      >
        {/* Toggle button for closed sidebar */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-20 left-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Menu className="w-5 h-5 text-gray-800" />
          </button>
        )}

        {messages.length === 0 ? (
          // Empty state UI
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center mb-8">
                <Brain className="w-16 h-16 text-gray-800 mb-4" />
                <h1 className="text-4xl font-semibold mb-2 font-montserrat-alt" 
                    style={gradientTextStyle}>
                  HI, I'M  HOMOSAPIEUS
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
                          onClick={() => handleOptionSelect(option.name)}
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
                          className={`inline-flex items-center rounded-2xl px-4 h-10 shadow-sm ${
                            message.role === 'assistant'
                              ? 'bg-white'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          <span className="leading-none">{message.content}</span>
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
                      <div className="bg-white rounded-2xl px-4 h-10 shadow-sm flex items-center">
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
                          onClick={() => handleOptionSelect(option.name)}
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
    </div>
  );
};

export default HomoSapieus;