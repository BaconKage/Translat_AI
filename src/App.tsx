import React, { useState } from 'react';
import Header from './components/Header';
import DocumentUpload from './components/DocumentUpload';
import TranslationViewer from './components/TranslationViewer';
import DocumentSummary from './components/DocumentSummary';
import BlockchainVerification from './components/BlockchainVerification';
import Glossary from './components/Glossary';
import CaseIntelligence from './components/CaseIntelligence';
import { translateText, extractTextFromFile, TranslationResult, TranslationSettings } from './utils/translationService';
import { Upload, FileText, BookOpen, Shield, BarChart3, ChevronRight, Brain } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [translationSettings, setTranslationSettings] = useState<TranslationSettings | null>(null);
  const [processingStage, setProcessingStage] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFileUpload = async (file: File, settings: TranslationSettings) => {
    setUploadedFile(file);
    setTranslationSettings(settings);
    setProcessingStage('processing');
    setProcessingProgress(0);
    
    try {
      // Extract text from file
      setProcessingProgress(20);
      const extractedText = await extractTextFromFile(file);
      
      setProcessingProgress(40);
      // Translate the text
      const result = await translateText(extractedText, settings, setProcessingProgress);
      
      setTranslationResult(result);
      setProcessingStage('completed');
      setActiveTab('translation');
    } catch (error) {
      console.error('Translation failed:', error);
      alert(`Translation failed: ${error.message}`);
      setProcessingStage('idle');
      setProcessingProgress(0);
    }
  };

  const tabs = [
    { id: 'upload', name: 'Upload', icon: Upload, enabled: true },
    { id: 'translation', name: 'Translation', icon: FileText, enabled: uploadedFile !== null },
    { id: 'case-intelligence', name: 'Case Intelligence', icon: Brain, enabled: uploadedFile !== null },
    { id: 'summary', name: 'Summary', icon: BarChart3, enabled: processingStage === 'completed' },
    { id: 'glossary', name: 'Glossary', icon: BookOpen, enabled: processingStage === 'completed' },
    { id: 'verification', name: 'Blockchain', icon: Shield, enabled: processingStage === 'completed' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <DocumentUpload darkMode={darkMode} onFileUpload={handleFileUpload} />;
      case 'translation':
        return <TranslationViewer 
          darkMode={darkMode} 
          translationResult={translationResult}
          translationSettings={translationSettings}
        />;
      case 'case-intelligence':
        return <CaseIntelligence 
          darkMode={darkMode} 
          translationResult={translationResult}
        />;
      case 'summary':
        return <DocumentSummary 
          darkMode={darkMode} 
          translationResult={translationResult}
        />;
      case 'glossary':
        return <Glossary 
          darkMode={darkMode} 
          keyTerms={translationResult?.keyTerms || []}
        />;
      case 'verification':
        return <BlockchainVerification darkMode={darkMode} translationResult={translationResult} />;
      default:
        return <DocumentUpload darkMode={darkMode} onFileUpload={handleFileUpload} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className={`hidden lg:block w-64 min-h-screen border-r transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                const isEnabled = tab.enabled;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => isEnabled && setActiveTab(tab.id)}
                    disabled={!isEnabled}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? darkMode
                          ? 'bg-blue-900/30 text-blue-300 border border-blue-800'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isEnabled
                        ? darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        : darkMode
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{tab.name}</span>
                    {isEnabled && !isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>

            {processingStage === 'processing' && (
              <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                darkMode ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  <span className={`text-sm font-medium transition-colors ${
                    darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    Processing Document
                  </span>
                  <span className={`text-xs transition-colors ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {Math.round(processingProgress)}%
                  </span>
                </div>
                <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <div className={`text-xs transition-colors ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  AI is analyzing and translating your document with encryption enabled.
                </div>
              </div>
            )}

            {uploadedFile && (
              <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                darkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`font-medium mb-2 transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Document
                </h4>
                <p className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {uploadedFile.name}
                </p>
                <p className={`text-xs mt-1 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {translationSettings && (
                  <div className="mt-2 space-y-1">
                    <div className={`text-xs transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {translationSettings.sourceLanguage === 'auto' ? 'Auto-detect' : translationSettings.sourceLanguage.toUpperCase()} 
                      → {translationSettings.targetLanguage.toUpperCase()}
                    </div>
                    <div className={`text-xs transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Type: {translationSettings.documentType}
                    </div>
                    {translationSettings.confidentialMode && (
                      <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400">
                        <Shield className="w-3 h-3" />
                        <span>Confidential Mode</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-around py-2">
            {tabs.slice(0, 4).map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              const isEnabled = tab.enabled;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => isEnabled && setActiveTab(tab.id)}
                  disabled={!isEnabled}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? darkMode
                        ? 'text-blue-300'
                        : 'text-blue-700'
                      : isEnabled
                      ? darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                      : darkMode
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;