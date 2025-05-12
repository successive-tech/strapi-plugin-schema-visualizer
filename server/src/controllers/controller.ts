import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('schema-visualizer')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  async getTypes(ctx) {
    const contentTypes = await strapi
    .plugin('schema-visualizer')
    .service('service')
    .getContentTypes();
    // if (contentTypes) setImmediate(() => strapi.reload());
    ctx.body = contentTypes;
  },
});

export default controller;
