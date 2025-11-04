import React, { useState, useRef } from 'react';
import { Upload, FileText, Lock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  darkMode: boolean;
  onFileUpload: (file: File, settings: any) => void;
}

export default function DocumentUpload({ darkMode, onFileUpload }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [confidentialMode, setConfidentialMode] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [documentType, setDocumentType] = useState('legal');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size too large. Please upload a file smaller than 50MB.');
      return;
    }
    
    // Validate file type
    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const isValidType = supportedTypes.includes(file.type) || 
                       supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      alert('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.');
      return;
    }
    
    setUploadedFile(file);
    const settings = {
      confidentialMode,
      sourceLanguage,
      targetLanguage,
      documentType,
    };
    onFileUpload(file, settings);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className={`font-semibold transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Security & Translation Settings
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Source Language
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className={`w-full px-3 py-2 text-sm lg:text-base rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="auto">Auto-detect</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="pt">Portuguese</option>
                <option value="it">Italian</option>
                <option value="ru">Russian</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Target Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className={`w-full px-3 py-2 text-sm lg:text-base rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="pt">Portuguese</option>
                <option value="it">Italian</option>
                <option value="ru">Russian</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className={`w-full px-3 py-2 text-sm lg:text-base rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="legal">Legal Document</option>
                <option value="medical">Medical Document</option>
                <option value="technical">Technical Manual</option>
                <option value="financial">Financial Report</option>
                <option value="general">General Document</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center space-x-2 flex-1">
                <Lock className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-200">
                    Confidential Mode
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 hidden sm:block">
                    Process in memory only
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={confidentialMode}
                  onChange={(e) => setConfidentialMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative p-4 sm:p-8 rounded-xl border-2 border-dashed transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
            : darkMode
            ? 'border-gray-600 bg-gray-800 hover:border-gray-500'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {uploadedFile ? (
            <div className="space-y-4">
              <CheckCircle className="mx-auto w-12 h-12 text-green-600" />
              <div>
                <h3 className={`text-lg font-semibold transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  File Ready for Translation
                </h3>
                <p className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Encrypted and Secure
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className={`mx-auto w-12 h-12 transition-colors ${
                dragActive ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <div>
                <h3 className={`text-lg font-semibold transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Upload Document for Translation
                </h3>
                <p className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Drag & drop your document here, or click to browse
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">PDF (up to 50MB)</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">DOCX</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">DOC</span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">TXT</span>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
        />
      </div>

      {confidentialMode && (
        <div className={`p-4 rounded-lg border-l-4 border-amber-500 transition-colors ${
          darkMode ? 'bg-amber-900/20' : 'bg-amber-50'
        }`}>
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className={`font-medium transition-colors ${
                darkMode ? 'text-amber-200' : 'text-amber-800'
              }`}>
                Confidential Mode Enabled
              </h4>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-amber-300' : 'text-amber-700'
              }`}>
                Your document will be processed entirely in memory and automatically deleted after translation. 
                No copies will be stored on our servers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}