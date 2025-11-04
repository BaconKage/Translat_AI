import React, { useState, useMemo } from 'react';
import { Book, Search, Download, Filter, Star, Copy, Volume2, BookOpen, Tag, TrendingUp, Eye, ChevronDown, ChevronUp, ExternalLink, Bookmark } from 'lucide-react';
import { KeyTerm } from '../utils/translationService';

interface GlossaryProps {
  darkMode: boolean;
  keyTerms: KeyTerm[];
}

export default function Glossary({ darkMode, keyTerms }: GlossaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const [favoriteTerms, setFavoriteTerms] = useState<Set<string>>(new Set());
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(keyTerms.map(entry => entry.category))];
    return cats.map(cat => ({
      id: cat,
      name: cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1),
      count: cat === 'all' ? keyTerms.length : keyTerms.filter(term => term.category === cat).length
    }));
  }, [keyTerms]);

  const filteredEntries = useMemo(() => {
    return keyTerms
      .filter(entry => {
        const matchesSearch = entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            entry.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            entry.explanation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'confidence':
            return b.confidence - a.confidence;
          case 'category':
            return a.category.localeCompare(b.category) || a.term.localeCompare(b.term);
          case 'favorites':
            const aFav = favoriteTerms.has(a.term);
            const bFav = favoriteTerms.has(b.term);
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return a.term.localeCompare(b.term);
          default:
            return a.term.localeCompare(b.term);
        }
      });
  }, [keyTerms, searchTerm, filterCategory, sortBy, favoriteTerms]);

  const toggleExpanded = (term: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);
    }
    setExpandedTerms(newExpanded);
  };

  const toggleFavorite = (term: string) => {
    const newFavorites = new Set(favoriteTerms);
    if (newFavorites.has(term)) {
      newFavorites.delete(term);
    } else {
      newFavorites.add(term);
    }
    setFavoriteTerms(newFavorites);
  };

  const copyToClipboard = async (text: string, term: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTerm(term);
      setTimeout(() => setCopiedTerm(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const speakTerm = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const exportGlossary = () => {
    const glossaryData = filteredEntries.map(term => ({
      term: term.term,
      translation: term.translation,
      explanation: term.explanation,
      context: term.context,
      examples: term.examples,
      confidence: term.confidence,
      category: term.category
    }));

    const dataStr = JSON.stringify(glossaryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'glossary-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return darkMode ? 'text-green-400' : 'text-green-600';
    if (confidence >= 85) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) return { text: 'Excellent', color: 'green' };
    if (confidence >= 85) return { text: 'Good', color: 'yellow' };
    return { text: 'Fair', color: 'red' };
  };

  if (!keyTerms || keyTerms.length === 0) {
    return (
      <div className={`text-center py-12 transition-colors ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No glossary terms available. Please translate a document first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header & Controls */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Smart Glossary
              </h3>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                AI-powered term explanations and translations
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportGlossary}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                darkMode 
                  ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list'
                    ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'grid'
                    ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search terms, translations, or explanations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="alphabetical">A-Z</option>
            <option value="confidence">Confidence</option>
            <option value="category">Category</option>
            <option value="favorites">Favorites First</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setSortBy('alphabetical');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Clear Filters
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-3 rounded-lg transition-colors ${
            darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <div className={`text-base lg:text-lg font-bold transition-colors ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {filteredEntries.length}
            </div>
            <div className={`text-xs transition-colors ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Terms Found
            </div>
          </div>
          
          <div className={`p-3 rounded-lg transition-colors ${
            darkMode ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <div className={`text-lg font-bold transition-colors ${
              darkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              {Math.round(keyTerms.reduce((acc, term) => acc + term.confidence, 0) / keyTerms.length)}%
            </div>
            <div className={`text-xs transition-colors ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              Avg Confidence
            </div>
          </div>
          
          <div className={`p-3 rounded-lg transition-colors ${
            darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
          }`}>
            <div className={`text-lg font-bold transition-colors ${
              darkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>
              {categories.length - 1}
            </div>
            <div className={`text-xs transition-colors ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>
              Categories
            </div>
          </div>
          
          <div className={`p-3 rounded-lg transition-colors ${
            darkMode ? 'bg-amber-900/20' : 'bg-amber-50'
          }`}>
            <div className={`text-lg font-bold transition-colors ${
              darkMode ? 'text-amber-300' : 'text-amber-700'
            }`}>
              {favoriteTerms.size}
            </div>
            <div className={`text-xs transition-colors ${
              darkMode ? 'text-amber-400' : 'text-amber-600'
            }`}>
              Favorites
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Glossary Entries */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {filteredEntries.map((entry, index) => {
          const isExpanded = expandedTerms.has(entry.term);
          const isFavorite = favoriteTerms.has(entry.term);
          const confidenceBadge = getConfidenceBadge(entry.confidence);
          
          return (
            <div key={index} className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
              darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              {/* Term Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className={`text-lg font-bold transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {entry.term}
                    </h4>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium transition-colors ${
                        darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Tag className="w-3 h-3 inline mr-1" />
                        {entry.category}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        confidenceBadge.color === 'green' 
                          ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                          : confidenceBadge.color === 'yellow'
                          ? darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                          : darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                      }`}>
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {confidenceBadge.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-xl font-semibold mb-2 transition-colors ${
                    darkMode ? 'text-green-400' : 'text-green-700'
                  }`}>
                    {entry.translation}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(entry.term)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite
                        ? darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                        : darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => copyToClipboard(entry.translation, entry.term)}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedTerm === entry.term
                        ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                        : darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => speakTerm(entry.translation)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => toggleExpanded(entry.term)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Definition */}
              <div className={`p-4 rounded-lg mb-4 transition-colors ${
                darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <p className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {entry.explanation}
                </p>
              </div>

              {/* Confidence and Context */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Confidence:
                    </span>
                    <span className={`text-sm font-bold ${getConfidenceColor(entry.confidence)}`}>
                      {entry.confidence}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {entry.context}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                    <h5 className={`font-semibold mb-2 flex items-center space-x-2 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <Eye className="w-4 h-4" />
                      <span>Usage Examples:</span>
                    </h5>
                    <div className="space-y-2">
                      {entry.examples.map((example, exIndex) => (
                        <div key={exIndex} className={`p-3 rounded-lg border-l-4 border-blue-500 transition-colors ${
                          darkMode ? 'bg-blue-900/10' : 'bg-blue-50'
                        }`}>
                          <p className={`text-sm italic transition-colors ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            "{example}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => copyToClipboard(`${entry.term}: ${entry.translation}\n\n${entry.explanation}`, entry.term)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Copy className="w-3 h-3 inline mr-1" />
                      Copy Full Entry
                    </button>
                    
                    <button
                      onClick={() => speakTerm(`${entry.term}. Translation: ${entry.translation}. ${entry.explanation}`)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Volume2 className="w-3 h-3 inline mr-1" />
                      Listen
                    </button>
                    
                    <button className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      Research
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredEntries.length === 0 && (
        <div className={`text-center py-12 transition-colors ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No terms match your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
            }}
            className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              darkMode 
                ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Copy Success Toast */}
      {copiedTerm && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Copy className="w-4 h-4" />
          <span className="text-sm font-medium">Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

// Helper function for confidence badges
function getConfidenceBadge(confidence: number) {
  if (confidence >= 95) return { text: 'Excellent', color: 'green' };
  if (confidence >= 85) return { text: 'Good', color: 'yellow' };
  return { text: 'Fair', color: 'red' };
}