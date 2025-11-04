import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Search, Filter, BookOpen, TrendingUp, Users, Calendar, MapPin, Building, DollarSign, Hash, Eye, ChevronDown, ChevronUp, Bookmark, BookmarkCheck, Download, BarChart3, Clock, AlertCircle, CheckCircle, Star, Copy, ExternalLink } from 'lucide-react';
import { TranslationResult } from '../utils/translationService';
import { analyzeCaseIntelligence, CaseIntelligenceResult, ExtractedEntity, SimilarCase } from '../utils/caseIntelligenceService';

interface CaseIntelligenceProps {
  darkMode: boolean;
  translationResult: TranslationResult | null;
}

export default function CaseIntelligence({ darkMode, translationResult }: CaseIntelligenceProps) {
  const [analysisResult, setAnalysisResult] = useState<CaseIntelligenceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<'auto' | 'legal' | 'medical' | 'technical'>('auto');
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'confidence' | 'date'>('relevance');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());
  const [bookmarkedCases, setBookmarkedCases] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const runAnalysis = async () => {
    if (!translationResult?.originalText) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeCaseIntelligence(translationResult.originalText, selectedDomain);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (translationResult?.originalText && !analysisResult) {
      runAnalysis();
    }
  }, [translationResult]);

  const filteredCases = useMemo(() => {
    if (!analysisResult) return [];
    
    return analysisResult.similarCases
      .filter(case_ => {
        const matchesSearch = searchTerm === '' || 
          case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          case_.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          case_.keyTerms.some(term => term.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesConfidence = confidenceFilter === 'all' ||
          (confidenceFilter === 'high' && case_.confidence >= 80) ||
          (confidenceFilter === 'medium' && case_.confidence >= 50 && case_.confidence < 80) ||
          (confidenceFilter === 'low' && case_.confidence < 50);
        
        return matchesSearch && matchesConfidence;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'confidence':
            return b.confidence - a.confidence;
          case 'date':
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          default:
            return b.relevanceScore - a.relevanceScore;
        }
      });
  }, [analysisResult, searchTerm, confidenceFilter, sortBy]);

  const filteredEntities = useMemo(() => {
    if (!analysisResult) return [];
    
    return analysisResult.extractedEntities.filter(entity => 
      entityTypeFilter === 'all' || entity.type === entityTypeFilter
    );
  }, [analysisResult, entityTypeFilter]);

  const toggleExpanded = (caseId: string) => {
    const newExpanded = new Set(expandedCases);
    if (newExpanded.has(caseId)) {
      newExpanded.delete(caseId);
    } else {
      newExpanded.add(caseId);
    }
    setExpandedCases(newExpanded);
  };

  const toggleBookmark = (caseId: string) => {
    const newBookmarks = new Set(bookmarkedCases);
    if (newBookmarks.has(caseId)) {
      newBookmarks.delete(caseId);
    } else {
      newBookmarks.add(caseId);
    }
    setBookmarkedCases(newBookmarks);
  };

  const getEntityIcon = (type: string) => {
    const icons = {
      PERSON: Users,
      ORG: Building,
      DATE: Calendar,
      LOCATION: MapPin,
      MONEY: DollarSign,
      LEGAL_TERM: BookOpen,
      MEDICAL_TERM: BookOpen,
      TECHNICAL_TERM: BookOpen,
      MISC: Hash
    };
    return icons[type as keyof typeof icons] || Hash;
  };

  const getEntityColor = (type: string) => {
    const colors = {
      PERSON: 'blue',
      ORG: 'purple',
      DATE: 'green',
      LOCATION: 'orange',
      MONEY: 'yellow',
      LEGAL_TERM: 'red',
      MEDICAL_TERM: 'pink',
      TECHNICAL_TERM: 'indigo',
      MISC: 'gray'
    };
    return colors[type as keyof typeof colors] || 'gray';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'green';
    if (confidence >= 50) return 'yellow';
    return 'red';
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'legal': return '⚖️';
      case 'medical': return '🏥';
      case 'technical': return '💻';
      default: return '📄';
    }
  };

  const exportResults = () => {
    if (!analysisResult) return;
    
    const exportData = {
      analysis: {
        domain: analysisResult.detectedDomain,
        confidence: analysisResult.domainConfidence,
        processingTime: analysisResult.processingTime
      },
      entities: analysisResult.extractedEntities,
      cases: filteredCases,
      insights: analysisResult.insights,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case-intelligence-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!translationResult) {
    return (
      <div className={`text-center py-12 transition-colors ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No document available for case intelligence analysis.</p>
        <p className="text-sm mt-2">Please upload and translate a document first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Case Intelligence Analysis
              </h3>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                AI-powered case matching and domain analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportResults}
              disabled={!analysisResult}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                analysisResult
                  ? darkMode 
                    ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors ${
                darkMode 
                  ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
            </button>
          </div>
        </div>

        {/* Domain Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Domain Override
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as any)}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="auto">Auto-detect</option>
              <option value="legal">⚖️ Legal</option>
              <option value="medical">🏥 Medical</option>
              <option value="technical">💻 Technical</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Search Cases
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Confidence Filter
            </label>
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value as any)}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Confidence</option>
              <option value="high">🟢 High (80%+)</option>
              <option value="medium">🟡 Medium (50-79%)</option>
              <option value="low">🔴 Low (&lt;50%)</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="relevance">Relevance</option>
              <option value="confidence">Confidence</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
            darkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-700 hover:text-purple-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFilters && (
          <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Entity Type Filter
                </label>
                <select
                  value={entityTypeFilter}
                  onChange={(e) => setEntityTypeFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Entities</option>
                  <option value="PERSON">👤 Persons</option>
                  <option value="ORG">🏢 Organizations</option>
                  <option value="DATE">📅 Dates</option>
                  <option value="LEGAL_TERM">⚖️ Legal Terms</option>
                  <option value="MEDICAL_TERM">🏥 Medical Terms</option>
                  <option value="TECHNICAL_TERM">💻 Technical Terms</option>
                  <option value="LOCATION">📍 Locations</option>
                  <option value="MONEY">💰 Financial</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  View Mode
                </label>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-3 py-2 text-sm transition-colors ${
                      viewMode === 'list'
                        ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                        : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-3 py-2 text-sm transition-colors ${
                      viewMode === 'grid'
                        ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                        : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Quick Actions
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setConfidenceFilter('all');
                      setEntityTypeFilter('all');
                      setSortBy('relevance');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAnalyzing && (
        <div className={`p-6 rounded-xl border transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h4 className={`font-medium mb-2 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Analyzing Document with AI
            </h4>
            <p className={`text-sm transition-colors ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Extracting entities, detecting domain, and matching similar cases...
            </p>
          </div>
        </div>
      )}

      {analysisResult && (
        <>
          {/* Statistics Dashboard */}
          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Analysis Overview
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-lg transition-colors ${
                darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
              }`}>
                <div className={`text-base lg:text-2xl font-bold transition-colors ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  {getDomainIcon(analysisResult.detectedDomain)} {analysisResult.detectedDomain}
                </div>
                <div className={`text-sm transition-colors ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  Domain ({analysisResult.domainConfidence}% confidence)
                </div>
              </div>
              
              <div className={`p-4 rounded-lg transition-colors ${
                darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <div className={`text-base lg:text-2xl font-bold transition-colors ${
                  darkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  {filteredCases.length}
                </div>
                <div className={`text-sm transition-colors ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Similar Cases Found
                </div>
              </div>
              
              <div className={`p-4 rounded-lg transition-colors ${
                darkMode ? 'bg-green-900/20' : 'bg-green-50'
              }`}>
                <div className={`text-base lg:text-2xl font-bold transition-colors ${
                  darkMode ? 'text-green-300' : 'text-green-700'
                }`}>
                  {filteredEntities.length}
                </div>
                <div className={`text-sm transition-colors ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  Entities Extracted
                </div>
              </div>
              
              <div className={`p-4 rounded-lg transition-colors ${
                darkMode ? 'bg-amber-900/20' : 'bg-amber-50'
              }`}>
                <div className={`text-base lg:text-2xl font-bold transition-colors ${
                  darkMode ? 'text-amber-300' : 'text-amber-700'
                }`}>
                  {analysisResult.statistics?.averageConfidence.toFixed(0)}%
                </div>
                <div className={`text-sm transition-colors ${
                  darkMode ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  Avg Confidence
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-l-4 border-purple-500 transition-colors ${
              darkMode ? 'bg-purple-900/10' : 'bg-purple-50'
            }`}>
              <h4 className={`font-medium mb-2 transition-colors ${
                darkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Domain Analysis Reasoning
              </h4>
              <p className={`text-sm transition-colors ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {analysisResult.domainReasoning}
              </p>
            </div>
          </div>

          {/* Extracted Entities */}
          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Extracted Entities ({filteredEntities.length})
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {filteredEntities.map((entity, index) => {
                const IconComponent = getEntityIcon(entity.type);
                const color = getEntityColor(entity.type);
                
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors hover:shadow-md ${
                      color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200' :
                      color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200' :
                      color === 'green' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
                      color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200' :
                      color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200' :
                      color === 'red' ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
                      color === 'pink' ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200' :
                      color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200' :
                      'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
                    }`}
                    onClick={() => navigator.clipboard.writeText(entity.text)}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{entity.text}</span>
                    <span className="text-xs opacity-75">({entity.confidence}%)</span>
                  </div>
                );
              })}
            </div>
            
            {filteredEntities.length === 0 && (
              <div className={`text-center py-8 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No entities match the current filter.</p>
              </div>
            )}
          </div>

          {/* Similar Cases */}
          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Similar Cases ({filteredCases.length})
              </h3>
              
              <div className="flex items-center space-x-2">
                <span className={`text-sm transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {bookmarkedCases.size} bookmarked
                </span>
              </div>
            </div>
            
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              {filteredCases.map((case_, index) => {
                const isExpanded = expandedCases.has(case_.id);
                const isBookmarked = bookmarkedCases.has(case_.id);
                const confidenceColor = getConfidenceColor(case_.confidence);
                
                return (
                  <div
                    key={case_.id}
                    className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                      darkMode ? 'bg-gray-900/50 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Case Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className={`font-bold text-lg transition-colors ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {case_.title}
                          </h4>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium transition-colors ${
                              darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {case_.domain}
                            </span>
                            
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              confidenceColor === 'green' 
                                ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                                : confidenceColor === 'yellow'
                                ? darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                                : darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                            }`}>
                              {case_.confidence}% confidence
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-3 transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {case_.summary}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className={`transition-colors ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {new Date(case_.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className={`transition-colors ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {case_.relevanceScore}% relevance
                            </span>
                          </div>
                          
                          {case_.jurisdiction && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className={`transition-colors ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {case_.jurisdiction}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleBookmark(case_.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isBookmarked
                              ? darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                              : darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => toggleExpanded(case_.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Key Terms */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {case_.keyTerms.slice(0, isExpanded ? case_.keyTerms.length : 5).map((term, termIndex) => (
                          <span
                            key={termIndex}
                            className={`px-2 py-1 text-xs rounded-full transition-colors ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {term}
                          </span>
                        ))}
                        {!isExpanded && case_.keyTerms.length > 5 && (
                          <span className={`px-2 py-1 text-xs rounded-full transition-colors ${
                            darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                          }`}>
                            +{case_.keyTerms.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className={`font-medium mb-2 transition-colors ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Case Details
                            </h5>
                            <div className="space-y-2 text-sm">
                              {case_.caseType && (
                                <div className="flex justify-between">
                                  <span className={`transition-colors ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    Type:
                                  </span>
                                  <span className={`transition-colors ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    {case_.caseType}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className={`transition-colors ${
                                  darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  Source:
                                </span>
                                <span className={`transition-colors ${
                                  darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {case_.source}
                                </span>
                              </div>
                              {case_.complexity && (
                                <div className="flex justify-between">
                                  <span className={`transition-colors ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    Complexity:
                                  </span>
                                  <span className={`capitalize transition-colors ${
                                    case_.complexity === 'high' ? 'text-red-600 dark:text-red-400' :
                                    case_.complexity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-green-600 dark:text-green-400'
                                  }`}>
                                    {case_.complexity}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className={`font-medium mb-2 transition-colors ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Tags
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {case_.tags?.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                    darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(`${case_.title}\n\n${case_.summary}\n\nSource: ${case_.source}\nDate: ${case_.date}`)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            Copy
                          </button>
                          
                          {case_.citationLink && (
                            <a
                              href={case_.citationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                darkMode 
                                  ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              <ExternalLink className="w-3 h-3 inline mr-1" />
                              View Source
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {filteredCases.length === 0 && (
              <div className={`text-center py-12 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cases match your current filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setConfidenceFilter('all');
                  }}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    darkMode 
                      ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-4 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              AI Insights & Recommendations
            </h3>
            
            <div className="space-y-3">
              {analysisResult.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                    darkMode ? 'bg-blue-900/10 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className={`text-sm transition-colors ${
                    darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Analysis completed in {analysisResult.processingTime}ms
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className={`transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {analysisResult.statistics?.totalMatches} total matches found
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}