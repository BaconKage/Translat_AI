import React from 'react';
import { FileText, AlertCircle, Clock, DollarSign, Scale, User, CheckCircle, Check } from 'lucide-react';
import { TranslationResult } from '../utils/translationService';

interface DocumentSummaryProps {
  darkMode: boolean;
  translationResult: TranslationResult | null;
}

export default function DocumentSummary({ darkMode, translationResult }: DocumentSummaryProps) {
  if (!translationResult) {
    return (
      <div className={`text-center py-12 transition-colors ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No document summary available. Please translate a document first.</p>
      </div>
    );
  }

  // Use the generated summary from translation result
  const summaryData = translationResult.summary;
  
  if (!summaryData) {
    return (
      <div className={`text-center py-12 transition-colors ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Summary generation in progress. Please wait...</p>
      </div>
    );
  }

  // Icon mapping for critical clauses
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Clock,
      Scale,
      User,
      AlertCircle,
      CheckCircle,
      Check
    };
    return icons[iconName] || AlertCircle;
  };

  const getClauseColor = (color: string) => {
    const colors = {
      red: darkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-800',
      blue: darkMode ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800',
      green: darkMode ? 'bg-green-900/20 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-800',
      amber: darkMode ? 'bg-amber-900/20 border-amber-800 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className={`font-semibold transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Document Summary
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className={`font-medium mb-2 transition-colors ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {summaryData.title}
            </h4>
            <span className={`inline-block px-2 py-1 text-xs rounded-full transition-colors ${
              darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}>
              {summaryData.documentType}
            </span>
          </div>

          <div>
            <h5 className={`font-medium mb-2 transition-colors ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Key Points:
            </h5>
            <ul className="space-y-1">
              {summaryData.keyPoints.map((point, index) => (
                <li key={index} className={`text-sm flex items-start transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Critical Clauses */}
      <div className={`p-6 rounded-xl border transition-colors ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className={`font-semibold transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Critical Clauses & Terms
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaryData.criticalClauses.map((clause, index) => {
            const IconComponent = getIconComponent(clause.icon);
            return (
              <div key={index} className={`p-4 rounded-lg border transition-colors ${
                getClauseColor(clause.color)
              }`}>
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">{clause.text}</p>
                    <p className="text-xs opacity-80">{clause.impact}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment & Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className={`p-6 rounded-xl border transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm lg:text-base font-semibold mb-4 transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Risk Assessment
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Overall Risk Level:
              </span>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                summaryData.riskAssessment.overall === 'Low' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : summaryData.riskAssessment.overall === 'Medium'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {summaryData.riskAssessment.overall}
              </span>
            </div>
            
            <div>
              <h4 className={`text-sm font-medium mb-2 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Risk Factors:
              </h4>
              <ul className="space-y-1">
                {summaryData.riskAssessment.factors.map((factor, index) => (
                  <li key={index} className={`text-sm flex items-start transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0 ${
                      summaryData.riskAssessment.overall === 'Low' 
                        ? 'bg-green-500'
                        : summaryData.riskAssessment.overall === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}></span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm lg:text-base font-semibold mb-4 transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recommended Next Actions
          </h3>
          
          <ul className="space-y-2">
            {summaryData.nextActions.map((action, index) => (
              <li key={index} className={`text-sm flex items-start transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium mr-2 flex-shrink-0 mt-0.5 transition-colors ${
                  darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                }`}>
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}