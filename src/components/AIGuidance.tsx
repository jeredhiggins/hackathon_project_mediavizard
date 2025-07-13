import React from 'react';
import { Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AIGuidance: React.FC = () => {
  const { t } = useLanguage();

  const safetyTips = [
    t('safetyTip1'),
    t('safetyTip2'),
    t('safetyTip3'),
    t('safetyTip4'),
    t('safetyTip5')
  ];

  const resources = [
    { name: t('resource1'), url: 'https://www.eff.org/issues/privacy' },
    { name: t('resource2'), url: 'https://privacyinternational.org/' },
    { name: t('resource3'), url: 'https://digitalrightsfoundation.pk/' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('aiGuidance')}</h3>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">{t('privacyWarning')}</h4>
                <p className="text-amber-700 dark:text-amber-400 text-sm">{t('warningText')}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t('safetyTips')}</h4>
            <ul className="space-y-2">
              {safetyTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 bg-blue-600 dark:text-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t('resources')}</h4>
            <div className="grid gap-2">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {resource.name}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">{t('legalDisclaimer')}</h4>
            <p className="text-red-700 dark:text-red-400 text-sm">{t('disclaimerText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};