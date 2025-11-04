import React, { useState } from 'react';
import { BookOpen, MessageCircle, Highlighter as Highlight, Download, Share2, CheckCircle2 } from 'lucide-react';
import { TranslationResult, TranslationSettings, LANGUAGES } from '../utils/translationService';

interface TranslationViewerProps {
  darkMode: boolean;
  translationResult: TranslationResult | null;
  translationSettings: TranslationSettings | null;
}

export default function TranslationViewer({ darkMode, translationResult, translationSettings }: TranslationViewerProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  if (!translationResult || !translationSettings) {
    return (
      <div className={`text-center py-12 transition-colors ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No translation available. Please upload a document first.</p>
      </div>
    );
  }

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
  };

  const renderTextWithTerms = (text: string) => {
    let renderedText = text;
    
    // Sort terms by length (longest first) to avoid partial replacements
    const sortedTerms = [...translationResult.keyTerms].sort((a, b) => b.term.length - a.term.length);
    
    sortedTerms.forEach(keyTerm => {
      const escapedTerm = keyTerm.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedTerm})\\b`, 'gi');
      renderedText = renderedText.replace(regex, `<span class="term-highlight cursor-pointer px-1 py-0.5 rounded ${
        darkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      } transition-colors" data-term="${keyTerm.term}">$1</span>`);
    });
    
    return renderedText;
  };

  const getLanguageInfo = (code: string) => {
    return LANGUAGES[code as keyof typeof LANGUAGES] || { name: code.toUpperCase(), flag: '🌐' };
  };

  const sourceLanguage = getLanguageInfo(translationResult.detectedLanguage || translationSettings.sourceLanguage);
  const targetLanguage = getLanguageInfo(translationSettings.targetLanguage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Original Document */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm lg:text-base font-semibold flex items-center transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <BookOpen className="w-5 h-5 mr-2" />
            Original Document
          </h3>
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded flex items-center space-x-1 flex-shrink-0">
            <span>{sourceLanguage.flag}</span>
            <span>{sourceLanguage.code.toUpperCase()}</span>
          </span>
        </div>
        
        <div className={`prose max-w-none text-xs sm:text-sm transition-colors ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <div
            dangerouslySetInnerHTML={{ __html: renderTextWithTerms(translationResult.originalText) }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.dataset.term) {
                handleTermClick(target.dataset.term);
              }
            }}
          />
        </div>
      </div>

      {/* Translated Document */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm lg:text-base font-semibold flex items-center transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Translation
          </h3>
          <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-xs rounded text-green-800 dark:text-green-200 flex items-center space-x-1 flex-shrink-0">
            <span>{targetLanguage.flag}</span>
            <span>{targetLanguage.code.toUpperCase()}</span>
          </span>
        </div>
        
        <div className={`prose max-w-none text-xs sm:text-sm transition-colors ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {translationResult.translatedText}
          </div>
        </div>
      </div>

      {/* Term Explanation Panel */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-sm lg:text-base font-semibold mb-4 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Term Explanations
        </h3>
        
        {selectedTerm && translationResult.keyTerms.find(t => t.term === selectedTerm) ? (
          <div className="space-y-4">
            {(() => {
              const term = translationResult.keyTerms.find(t => t.term === selectedTerm);
              if (!term) return null;
              
              return (
            <div className={`p-4 rounded-lg transition-colors ${
              darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h4 className={`font-medium text-blue-700 dark:text-blue-300 mb-2`}>
                "{selectedTerm}"
              </h4>
              <p className={`text-sm mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <strong>Translation:</strong> {term.translation}
              </p>
              <p className={`text-sm mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <strong>Explanation:</strong> {term.explanation}
              </p>
              <p className={`text-sm mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <strong>Context:</strong> {term.context}
              </p>
              <div className="mt-3">
                <p className={`text-xs font-medium mb-2 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Usage Examples:
                </p>
                <ul className={`text-xs space-y-1 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {term.examples.map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
              );
            })()}
          </div>
        ) : (
          <div className={`text-center py-8 transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click on highlighted terms in the original document to see explanations</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Translation Quality: {translationResult.confidence}%</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Translated using live API • Terms added to glossary
          </div>
        </div>
      </div>
    </div>
  );
}