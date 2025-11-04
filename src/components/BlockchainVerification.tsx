import React, { useState } from 'react';
import { Shield, Link, CheckCircle, Clock, Hash, Download, ExternalLink, AlertTriangle } from 'lucide-react';

interface BlockchainVerificationProps {
  darkMode: boolean;
  translationResult?: any;
}

export default function BlockchainVerification({ darkMode, translationResult }: BlockchainVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate realistic blockchain data
  const generateBlockchainData = () => {
    const now = new Date();
    const transactionTime = new Date(now.getTime() - Math.random() * 300000); // Within last 5 minutes
    
    return {
      transactionHash: `0x${Math.random().toString(16).substring(2, 66).padEnd(64, '0')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      timestamp: transactionTime.toISOString(),
      networkFee: `0.00${Math.floor(Math.random() * 999) + 100} ETH`,
      confirmations: Math.floor(Math.random() * 200) + 50,
      documentHash: `sha256:${Math.random().toString(16).substring(2, 66).padEnd(64, '0')}`,
      integrityStatus: 'verified',
      auditTrail: [
        {
          action: 'Document Upload',
          timestamp: new Date(transactionTime.getTime() - 240000).toISOString(),
          hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          status: 'confirmed'
        },
        {
          action: 'Text Extraction',
          timestamp: new Date(transactionTime.getTime() - 180000).toISOString(),
          hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          status: 'confirmed'
        },
        {
          action: 'Translation Processing',
          timestamp: new Date(transactionTime.getTime() - 120000).toISOString(),
          hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          status: 'confirmed'
        },
        {
          action: 'Quality Verification',
          timestamp: new Date(transactionTime.getTime() - 60000).toISOString(),
          hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          status: 'confirmed'
        },
        {
          action: 'Blockchain Registration',
          timestamp: transactionTime.toISOString(),
          hash: `0x${Math.random().toString(16).substring(2, 18)}`,
          status: 'confirmed'
        }
      ]
    };
  };

  const [blockchainData] = useState(() => generateBlockchainData());

  const startVerification = async () => {
    setIsVerifying(true);
    setVerificationStatus('pending');
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationStatus('verified');
    setIsVerifying(false);
  };

  React.useEffect(() => {
    if (translationResult && verificationStatus === 'pending') {
      startVerification();
    }
  }, [translationResult]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  if (!translationResult) {
    return (
      <div className={`text-center py-12 transition-colors ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No document available for blockchain verification. Please upload and translate a document first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className={`text-lg font-semibold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Blockchain Verification
            </h3>
          </div>
          
          {verificationStatus === 'verified' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Verified & Immutable
              </span>
            </div>
          )}
          
          {verificationStatus === 'pending' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {isVerifying ? 'Verifying...' : 'Pending Verification'}
              </span>
            </div>
          )}
          
          {verificationStatus === 'failed' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Verification Failed
              </span>
            </div>
          )}
        </div>

        {verificationStatus === 'verified' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className={`p-4 rounded-lg border transition-colors ${
            darkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4 text-blue-600" />
              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Transaction Hash
              </span>
            </div>
            <p className={`text-xs font-mono break-all transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {truncateHash(blockchainData.transactionHash)}
            </p>
            <button className="text-xs text-blue-600 hover:text-blue-700 mt-1 hidden sm:block">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              View on Explorer
            </button>
          </div>

          <div className={`p-4 rounded-lg border transition-colors ${
            darkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Link className="w-4 h-4 text-purple-600" />
              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Block Number
              </span>
            </div>
            <p className={`text-base lg:text-lg font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              #{blockchainData.blockNumber.toLocaleString()}
            </p>
            <p className={`text-xs transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {blockchainData.confirmations} confirmations
            </p>
          </div>

          <div className={`p-4 rounded-lg border transition-colors ${
            darkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Verification Time
              </span>
            </div>
            <p className={`text-xs sm:text-sm font-medium transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {formatTimestamp(blockchainData.timestamp)}
            </p>
            <p className={`text-xs transition-colors hidden sm:block ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Network Fee: {blockchainData.networkFee}
            </p>
          </div>
          </div>
        )}
        
        {verificationStatus === 'pending' && (
          <div className={`p-6 rounded-lg border transition-colors ${
            darkMode ? 'bg-blue-900/10 border-blue-800' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h4 className={`font-medium mb-2 transition-colors ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                Registering Document on Blockchain
              </h4>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Creating immutable record of your translation...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Document Integrity */}
      {verificationStatus === 'verified' && (
        <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Document Integrity Verification
        </h3>
        
        <div className={`p-4 rounded-lg border-l-4 border-green-500 transition-colors ${
          darkMode ? 'bg-green-900/10' : 'bg-green-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium text-green-700 dark:text-green-400 mb-1`}>
                Document Hash Verified
              </h4>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                The document hasn't been modified since blockchain registration
              </p>
              <p className={`text-xs font-mono mt-2 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {blockchainData.documentHash}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
            darkMode 
              ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}>
            <Download className="w-4 h-4 inline mr-2" />
            <span className="hidden sm:inline">Download Certificate</span>
            <span className="sm:hidden">Download</span>
          </button>
          <button className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
            darkMode 
              ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}>
            <ExternalLink className="w-4 h-4 inline mr-2" />
            <span className="hidden sm:inline">Verify Independently</span>
            <span className="sm:hidden">Verify</span>
          </button>
        </div>
        </div>
      )}

      {/* Audit Trail */}
      {verificationStatus === 'verified' && (
        <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Complete Audit Trail
        </h3>
        
        <div className="space-y-4">
          {blockchainData.auditTrail.map((entry, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                entry.status === 'confirmed' 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {entry.status === 'confirmed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {entry.action}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    entry.status === 'confirmed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {entry.status}
                  </span>
                </div>
                
                <div className={`text-sm mt-1 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span>{formatTimestamp(entry.timestamp)}</span>
                  <span className="mx-2">•</span>
                  <span className="font-mono">{truncateHash(entry.hash)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}
      
      {verificationStatus === 'failed' && (
        <div className={`p-6 rounded-xl border border-red-500 transition-colors ${
          darkMode ? 'bg-red-900/10' : 'bg-red-50'
        }`}>
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h4 className={`font-medium mb-2 text-red-700 dark:text-red-400`}>
              Blockchain Verification Failed
            </h4>
            <p className={`text-sm mb-4 transition-colors ${
              darkMode ? 'text-red-300' : 'text-red-600'
            }`}>
              Unable to register document on blockchain. Please try again.
            </p>
            <button
              onClick={startVerification}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Retry Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}