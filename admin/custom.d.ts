declare module '@strapi/design-system/*';
declare module '@strapi/design-system';
declare module '@strapi/helper-plugin';
declare module '@strapi/icons';
declare module '../utils/themeUtils';
declare module '../store';
declare module '../components/CustomNode';
declare module '../components/OptionsBar';
declare module '../components/ExportModal';

// Add declarations for JS files with extensions
declare module '../store/index.js';
declare module '../components/CustomNode.js';
declare module '../components/OptionsBar.js';
declare module '../components/ExportModal.js';

// Add CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Add custom theme type definition to fix theme property access errors
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors?: {
      neutral150?: string;
      neutral1000?: string;
      buttonPrimary500?: string;
      [key: string]: string | undefined;
    };
  }
}
