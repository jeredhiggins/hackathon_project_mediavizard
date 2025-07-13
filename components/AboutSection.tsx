import React from 'react';
import { WizardIcon } from './WizardIcon';
import { Shield, Zap, Eye, Users, Building, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  const scenarios = [
    { icon: Users, text: t('scenarios')[0] },
    { icon: Building, text: t('scenarios')[1] },
    { icon: Users, text: t('scenarios')[2] },
    { icon: Shield, text: t('scenarios')[3] },
    { icon: Building, text: t('scenarios')[4] },
    { icon: Camera, text: t('scenarios')[5] }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <WizardIcon className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('about')}</h3>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-600 dark:text-gray-400">{t('aboutDescription')}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('howToUse')}
            </h4>
            <ol className="space-y-2">
              {t('howToUseSteps').map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('whyUseful')}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('whyUsefulText')}</p>
            
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{t('realWorldScenarios')}</h5>
            <div className="grid gap-2 sm:grid-cols-2">
              {scenarios.map((scenario, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <scenario.icon className="h-3 w-3 text-purple-500" />
                  {scenario.text}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">{t('privacyWarning')}</h4>
                <p className="text-purple-700 dark:text-purple-400 text-sm">{t('warningText')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};