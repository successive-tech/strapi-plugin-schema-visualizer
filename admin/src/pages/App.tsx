import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';
import { DesignSystemProvider, darkTheme } from '@strapi/design-system';

import { HomePage } from './HomePage';

const App = () => {
  return (
    <DesignSystemProvider locale="en-GB" theme={darkTheme}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </DesignSystemProvider>
  );
};

export { App };
