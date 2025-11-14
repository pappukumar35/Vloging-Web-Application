
import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const PromptTooltip: React.FC = () => {
  return (
    <div className="relative group">
      <InformationCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 cursor-help" />
      <div className="absolute bottom-full mb-2 w-72 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
        <h4 className="font-bold mb-1">Tips for great prompts:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-semibold">Be descriptive:</span> "A majestic lion on a rock overlooking the savanna at sunset."
          </li>
          <li>
            <span className="font-semibold">Use styles:</span> "A watercolor painting of a Parisian cafe scene."
          </li>
           <li>
            <span className="font-semibold">Specify composition:</span> "A close-up shot of a blooming rose with morning dew."
          </li>
           <li>
            <span className="font-semibold">Add details:</span> "A hyperrealistic, cinematic photo of..."
          </li>
        </ul>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default PromptTooltip;
