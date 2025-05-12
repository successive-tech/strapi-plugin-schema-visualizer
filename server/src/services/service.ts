import type { Core } from '@strapi/strapi';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  async getContentTypes() {
    const types = strapi.contentTypes;

    let formattedTypes = Object.keys(types).map((key) => ({
      name: key,
      attributes: types[key]["attributes"],
      info: types[key]["info"],
      // kind: data[key]["kind"],
      key: types[key]["uid"],
    }));

    return formattedTypes;
  },
});

export default service;
