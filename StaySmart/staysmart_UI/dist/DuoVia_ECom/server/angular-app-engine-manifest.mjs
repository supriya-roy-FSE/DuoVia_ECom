
export default {
  basePath: '/DuoVia_ECom',
  allowedHosts: [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]"
],
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
