import React, { useState } from 'react';
import { Image, Brain, Info, ExternalLink } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { WizardIcon } from './components/WizardIcon';
import { FileUpload } from './components/FileUpload';
import { ImageRedaction } from './components/ImageRedaction';
import { AIGuidance } from './components/AIGuidance';
import { AboutSection } from './components/AboutSection';
import { useLanguage } from './contexts/LanguageContext';

type ActiveTab = 'image' | 'guidance' | 'about';
type ProcessingStep = 'upload' | 'process' | 'download';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProcessingStep('process');
  };

  const handleBack = () => {
    setSelectedFile(null);
    setProcessingStep('upload');
  };

  const renderStep = () => {
    if (processingStep === 'upload') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <WizardIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('appTitle')}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('appSubtitle')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'image' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={t('uploadImage')}
              >
                <Image className="h-4 w-4" />
                {t('uploadImage')}
              </button>
              <button
                onClick={() => setActiveTab('guidance')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'guidance' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={t('aiGuidance')}
              >
                <Brain className="h-4 w-4" />
                {t('aiGuidance')}
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'about' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={t('about')}
              >
                <Info className="h-4 w-4" />
                {t('about')}
              </button>
            </div>

            {activeTab === 'image' && (
              <FileUpload
                type="image"
                accept="image/jpeg,image/png,.jpg,.png"
                maxSize={20 * 1024 * 1024} // 20MB
                onFileSelect={handleFileSelect}
              />
            )}

            {activeTab === 'guidance' && <AIGuidance />}
            {activeTab === 'about' && <AboutSection />}
          </div>
        </div>
      );
    }

    if (processingStep === 'process' && selectedFile) {
      return <ImageRedaction file={selectedFile} onBack={handleBack} />;
    }

    return null;
  };

  const getStepNumber = () => {
    switch (processingStep) {
      case 'upload': return 1;
      case 'process': return 2;
      case 'download': return 3;
      default: return 1;
    }
  };

  const getStepTitle = () => {
    switch (processingStep) {
      case 'upload': return t('step1');
      case 'process': return t('step2');
      case 'download': return t('step3');
      default: return t('step1');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <WizardIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">{t('appTitle')}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {processingStep !== 'upload' && (
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {getStepNumber()}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">{getStepTitle()}</span>
              </div>
            </div>
          </div>
        )}
        
        {renderStep()}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            {/* Bolt.new Badge */}
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105"
              aria-label="Powered by Bolt.new - Visit Bolt.new"
            >
              <div className="relative">
                {/* Bolt.new Logo using SVG */}
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  Powered by Bolt.new
                </span>
                <ExternalLink className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </a>
            
            {/* Disclaimer */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              {t('disclaimerText')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;