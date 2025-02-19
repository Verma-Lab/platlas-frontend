import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, ArrowLeft, Menu, X, Stethoscope } from 'lucide-react';
import { 
    Brain, 
    Users, 
    FileSearch, 
    Database, 
    ActivitySquare,
    MessagesSquare,
    Search
  } from 'lucide-react';
  import { Dna } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Check } from 'lucide-react';
import LoginModal from '../components/AiLogin/LoginModal';

const baseURL = 'http://localhost:5001/api/aiapi';

const modelOptions = [
    { 
      name: 'Clinical Decision Support',
      description: 'Risk assessments & treatment recommendations based on integrated clinical and genomic data.',
      icon: FileSearch,
      modelType: 'clinical-decision'
    },
    { 
      name: 'Variant Interpretation',
      description: 'Analyze SNPs with evidence-based insights and actionable variant interpretations.',
      icon: Dna,
      modelType: 'variant-interpretation'
    },
    { 
      name: 'Population Health Insights',
      description: 'Compare and analyze diverse cohort data (AFR, AMR, EUR, etc.) for public health trends.',
      icon: Users,
      modelType: 'population-health'
    },
    { 
      name: 'Research Portal',
      description: 'Explore genotype-phenotype correlations across millions of SNPs for novel discoveries.',
      icon: ActivitySquare,
      modelType: 'research'
    },
    { 
      name: 'Personalized Patient Reports',
      description: 'Generate customized health reports and recommendations for individual patients.',
      icon: Database,
      modelType: 'patient-reports'
    }
  ];
  
  const ModelDocumentationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg w-full max-w-4xl my-8">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center rounded-t-lg">
            <h2 className="text-2xl font-semibold">Model Documentation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Modal Content */}
          <div className="p-6 space-y-6 text-gray-800">
            {/* 1. Clinical Decision Support */}
            <section>
              <h3 className="text-xl font-bold">1. Clinical Decision Support</h3>
              <p className="mt-2 font-medium">What it is:</p>
              <p>A tool that helps doctors make informed decisions by analyzing a patient’s medical notes, genetic data (SNPs), and observed traits (phenotypes).</p>
              <p className="mt-2 font-medium">How it works:</p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Data Analysis:</strong> The system takes in patient history and genetic data.</li>
                <li><strong>Risk Assessment:</strong> It calculates the risk of developing certain diseases based on patterns in the data.</li>
                <li><strong>Actionable Insights:</strong> It suggests which additional tests might be needed or which treatment options could be the best fit.</li>
              </ul>
              <p className="mt-2 font-medium">Example:</p>
              <p>A doctor enters a patient’s history along with their genetic profile. The system then flags a high risk for a heart condition based on certain SNPs and recommends a closer cardiac evaluation.</p>
            </section>
            
            {/* 2. Variant Interpretation */}
            <section>
              <h3 className="text-xl font-bold">2. Variant Interpretation</h3>
              <p className="mt-2 font-medium">What it is:</p>
              <p>A feature that explains what specific genetic variations (SNPs) might mean for a patient’s health.</p>
              <p className="mt-2 font-medium">How it works:</p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Identification:</strong> The system identifies which genetic variants are present.</li>
                <li><strong>Contextual Explanation:</strong> It provides evidence-based interpretations (e.g., “This SNP is known to increase cholesterol levels, which may lead to heart disease.”)</li>
                <li><strong>Link to Research:</strong> It connects these interpretations to current research or clinical guidelines.</li>
              </ul>
              <p className="mt-2 font-medium">Example:</p>
              <p>A patient’s SNP data shows a variant associated with a higher risk of diabetes. The system explains the connection, cites supporting studies, and might suggest monitoring blood sugar levels.</p>
            </section>
            
            {/* 3. Population Health Insights */}
            <section>
              <h3 className="text-xl font-bold">3. Population Health Insights</h3>
              <p className="mt-2 font-medium">What it is:</p>
              <p>A tool designed to compare and analyze diverse cohort data (AFR, AMR, EUR, etc.) for public health trends.</p>
              <p className="mt-2 font-medium">How it works:</p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Data Aggregation:</strong> It compiles data from thousands of patients across various cohorts.</li>
                <li><strong>Comparative Analysis:</strong> Researchers can compare how genetic variants and traits differ among groups.</li>
                <li><strong>Discover New Insights:</strong> This can lead to identifying population-specific risk factors or understanding how a disease manifests differently across populations.</li>
              </ul>
              <p className="mt-2 font-medium">Example:</p>
              <p>Researchers studying cardiovascular disease might discover that a particular SNP is more prevalent in the AFR cohort compared to the EUR cohort, suggesting the need for tailored treatments.</p>
            </section>
            
            {/* 4. Research Portal */}
            <section>
              <h3 className="text-xl font-bold">4. Research Portal</h3>
              <p className="mt-2 font-medium">What it is:</p>
              <p>A platform enabling researchers to explore genotype-phenotype correlations across millions of SNPs for novel discoveries.</p>
              <p className="mt-2 font-medium">How it works:</p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Data Exploration:</strong> In-depth search and exploration across vast SNP data.</li>
                <li><strong>Hypothesis Generation:</strong> Researchers can identify new candidate genes or variant clusters linked to diseases.</li>
                <li><strong>Integration with Literature:</strong> It connects to external research articles and databases to support findings.</li>
              </ul>
              <p className="mt-2 font-medium">Example:</p>
              <p>A researcher uses the portal to explore potential links between a set of SNPs and the manifestation of autoimmune diseases, identifying a novel candidate gene for further investigation.</p>
            </section>
            
            {/* 5. Personalized Patient Reports */}
            <section>
              <h3 className="text-xl font-bold">5. Personalized Patient Reports</h3>
              <p className="mt-2 font-medium">What it is:</p>
              <p>A feature that generates clear, personalized health reports and recommendations for individual patients.</p>
              <p className="mt-2 font-medium">How it works:</p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Simplified Reports:</strong> Translates complex genomic data into easy-to-understand summaries.</li>
                <li><strong>Actionable Advice:</strong> Provides personalized recommendations, including lifestyle changes and preventive measures.</li>
                <li><strong>Secure Access:</strong> Patients can view these reports via a secure online portal.</li>
              </ul>
              <p className="mt-2 font-medium">Example:</p>
              <p>A patient logs into the portal and reviews their personalized health report. The report details their genetic predispositions, explains potential health risks in simple terms, and suggests proactive measures such as dietary modifications and regular exercise.</p>
            </section>
            
            {/* How It All Comes Together */}
            <section>
              <h3 className="text-xl font-bold">How It All Comes Together</h3>
              <p className="mt-2">
                Imagine a platform where:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Doctors</strong> use the system to diagnose and plan treatments based on deep analysis of genetic and clinical data.</li>
                <li><strong>Researchers</strong> explore aggregated data to uncover new genotype-phenotype correlations across diverse populations.</li>
                <li><strong>Patients</strong> receive clear, personalized health information that empowers them to take proactive steps in managing their health.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  };
  
  const APIReferenceModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg w-full max-w-3xl my-8">
          {/* Header - Fixed at top */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center rounded-t-lg">
            <h2 className="text-2xl font-semibold">API Reference</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
  
          <div className="space-y-8 p-4">
            {/* Document Upload Section */}
            <section>
              <h3 className="text-xl font-medium mb-4">Document Upload</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Upload documents to enhance the model's knowledge base. Available only for @platlas.com and @homosapieus.com email domains.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                  <li>Supported file formats: PDF, DOCX, TXT</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Documents are processed and indexed for retrieval</li>
                </ul>
              </div>
            </section>
  
            {/* Data Integration & Standardization Section */}
            <section>
              <h3 className="text-xl font-medium mb-4">Data Integration & Standardization</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Our platform ingests and harmonizes multiple data types to ensure consistency and accuracy:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                  <li>
                    <strong>Patient Notes:</strong> Unstructured clinical text (e.g., doctor notes) in formats such as PDF, DOCX, and TXT.
                  </li>
                  <li>
                    <strong>Phenotype Data:</strong> Structured data capturing over 2,000 phenotypes per patient using standardized coding systems (e.g., SNOMED CT, ICD).
                  </li>
                  <li>
                    <strong>SNP Data:</strong> Genomic variant information standardized in VCF format, covering up to 20 million SNPs per cohort.
                  </li>
                  <li>
                    <strong>Cohort Tagging:</strong> Each patient’s data is tagged by cohort (e.g., AFR, AMR, EUR) to enable population-specific analysis.
                  </li>
                  <li>
                    <strong>Mapping & Normalization:</strong> ETL pipelines and mapping files convert data from diverse sources into a unified schema.
                  </li>
                  <li>
                    <strong>HL7/FHIR Normalization:</strong> Clinical data is standardized using HL7/FHIR protocols to ensure interoperability with EHR systems.
                  </li>
                  <li>
                    <strong>Data Security & Compliance:</strong> All data is encrypted and processed following HIPAA/GDPR guidelines, ensuring privacy and security.
                  </li>
                </ul>
                <p className="text-sm text-gray-600">
                  These processes enable our models to access clean, standardized, and well-integrated data, driving accurate and reliable insights.
                </p>
              </div>
            </section>
  
            {/* Chat Models Section */}
            <section>
              <h3 className="text-xl font-medium mb-4">Available Models</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">PLatlas</h4>
                  <p className="text-sm text-gray-600">
                    Retrieval-Augmented Generation (RAG) model trained on custom data. Uses uploaded documents for context-aware responses.
                  </p>
                </div>
  
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">HomoSapieus</h4>
                  <p className="text-sm text-gray-600">
                    Pre-trained language model optimized for general conversation and task completion.
                  </p>
                </div>
  
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Gemini</h4>
                  <p className="text-sm text-gray-600">
                    Google's advanced language model integrated for enhanced capabilities.
                  </p>
                </div>
  
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">GPT</h4>
                  <p className="text-sm text-gray-600">
                    OpenAI's language model for general-purpose conversation and tasks.
                  </p>
                </div>
              </div>
            </section>
  
            {/* Chat Features Section */}
            <section>
              <h3 className="text-xl font-medium mb-4">Chat Features</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Conversation Management</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                    <li>Create new conversations</li>
                    <li>Access conversation history</li>
                    <li>Switch between different models</li>
                    <li>Real-time typing indicators</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Model Selection</h4>
                  <p className="text-sm text-gray-600">
                    Switch between different models during conversation for optimal results:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                    <li>PLatlas: Best for domain-specific queries using uploaded documents</li>
                    <li>HomoSapieus: Ideal for general queries and task completion</li>
                    <li>Gemini & GPT: Alternative models for diverse capabilities</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };
  
  
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
  const [isAPIReferenceModalOpen, setIsAPIReferenceModalOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isModelDocModalOpen, setIsModelDocModalOpen] = useState(false);

  // New states for conversation list and the selected conversation ID
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch the conversation history when the component mounts (or when the user changes)
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      axios
        // .get(`${baseURL}/chat/history`, {
        .get(`/api/aiapi/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Assume response.data is an array of conversation objects.
          // Each conversation object could have the structure:
          // { id, messages: [ { role, content, createdAt, ... }, ... ] }
          console.log("chat history")
          console.log(response.data)
          setConversations(response.data);
        })
        .catch((err) => console.error('Error fetching conversation history:', err));
    }
  }, [user]);
// useEffect(() => {
//     if (user) {
//       const token = localStorage.getItem('token');
//       axios
//         .get(`/api/chat/history`, {
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

  // Function to start a new conversation
  const handleNewConversation = () => {
    const newConversationId = crypto.randomUUID(); // Generate new UUID
    setCurrentConversationId(newConversationId);
    setMessages([]); // Clear chat area
  };
  // When a conversation is clicked, load its messages into the chat area.
  const handleConversationSelect = (conversation) => {
    setCurrentConversationId(conversation.id);
    setMessages(conversation.messages);
  };
  
  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceType', selectedOption.toLowerCase());

    try {
    //   const response = await axios.post(`${baseURL}/documents/upload`, formData, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    const response = await axios.post(`/api/aiapi/documents/upload`, formData, {
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

    // If no current conversation ID, create one
    if (!currentConversationId) {
        const newConversationId = crypto.randomUUID();
        setCurrentConversationId(newConversationId);
    }

    // Add the message to the current conversation
    const newMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoginModalOpen(true);
            return;
        }

        const response = await axios.post(
            // `${baseURL}/chat/message`,
            `/api/aiapi/chat/message`,
            {
                message: inputValue,
                sourceType: selectedOption.toLowerCase(),
                conversationId: currentConversationId,  // Always include the conversation ID
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Add the assistant's response to the current conversation
        const assistantMessage = { 
            role: 'assistant', 
            content: response.data.message 
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Update conversations list to include this new message
        setConversations(prev => {
            const updatedConversations = [...prev];
            const currentConversationIndex = updatedConversations.findIndex(
                conv => conv.id === currentConversationId
            );

            if (currentConversationIndex === -1) {
                // This is a new conversation
                updatedConversations.unshift({
                    id: currentConversationId,
                    messages: [newMessage, assistantMessage]
                });
            } else {
                // Update existing conversation
                updatedConversations[currentConversationIndex].messages.push(
                    newMessage,
                    assistantMessage
                );
            }

            return updatedConversations;
        });

    } catch (error) {
        console.error('Error sending message:', error);
        // Optionally show error to user
    } finally {
        setIsTyping(false);
    }
};
  

  const options = [
    { name: 'HomoSapieus', icon: Brain },
    { name: 'PLatlas', icon: Brain },  // Added PLatlas option
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
            <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/landingPageHomo')}
          className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back</span>
        </button>

        {/* Add the model selector dropdown here */}
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Brain className="w-5 h-5" />
            <span>{selectedOption}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {isModelDropdownOpen && (
            <div className="absolute top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {modelOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    setSelectedOption(option.name);
                    setIsModelDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <option.icon className="w-10 h-10 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{option.name}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                  {selectedOption === option.name && (
                    <div className="ml-auto">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            {/* Right side */}
            <div className="flex items-center space-x-8">
            <button
                onClick={() => setIsModelDocModalOpen(true)}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Model Documentation
              </button>
            <button
                onClick={() => setIsAPIReferenceModalOpen(true)}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                API Reference
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
          <div className="mb-4">
            <button
              className="w-full px-3 py-3 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-all text-left"
            >
              <Stethoscope className="w-5 h-5 text-gray-800" />
              <span className="text-gray-800">HOMOSAPIEUS EHR</span>
            </button>
            {/* <button
              className="w-full px-3 py-3 flex items-center gap-3 hover:bg-gray-100 rounded-lg transition-all text-left"
            >
              <Brain className="w-5 h-5 text-gray-800" />
              <span className="text-gray-800">HOMOSAPIEUS DISEASE</span>
            </button> */}
          </div>
          <div className="w-full h-px bg-gray-200 my-4"></div>

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"> 
            <div className="bg-white rounded-lg p-6 relative">
              <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                   <div className="mt-4">
         <label
           htmlFor="sourceType"
           className="block text-sm font-medium text-gray-700 mb-1"
         >
           Select Source Type:
         </label>
         <select
           id="sourceType"
           value={selectedOption}
           onChange={(e) => setSelectedOption(e.target.value)}
           className="w-full rounded-md border-gray-300 shadow-sm"
         >
          <option value="homosapieus">HomoSapieus</option>
          <option value="platlas">PLatlas</option>
          <option value="gemini">Gemini</option>
           <option value="websearch">Web Search</option>
         <option value="gpt">GPT</option>
        </select>

       </div>
              <button onClick={handleFileUpload} className="mt-4 bg-black text-white p-2 px-2 rounded">
                Upload
              </button>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="mt-4 bg-gray-500 text-white p-2 ml-3 rounded"
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
          {user && (user.email.includes('@platlas.com') || user.email.includes('@homosapieus.com')) && (

          <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Upload Data To Models</h3>
              {/* <p className="text-sm text-gray-600 mb-3">Version 1.0.0</p> */}
              <button 
              onClick={() => setIsDocsModalOpen(true)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors">
              Upload Document
              </button>
            </div>
              )}

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
      <APIReferenceModal 
  isOpen={isAPIReferenceModalOpen}
  onClose={() => setIsAPIReferenceModalOpen(false)}
/>
<ModelDocumentationModal
        isOpen={isModelDocModalOpen}
        onClose={() => setIsModelDocModalOpen(false)}
      />
    </div>
  );
};

export default HomoSapieus;
