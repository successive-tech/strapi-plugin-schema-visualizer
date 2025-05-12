export default [
  {
    method: "GET",
    path: "/get-types",
    handler: "controller.getTypes",
    config: {
      policies: [],
      // auth: false,
    },
  },
];
