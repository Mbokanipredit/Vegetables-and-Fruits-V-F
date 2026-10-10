module.exports = {
  'vf-api': {
    output: {
      mode: 'tags-split',
      target: 'src/services/api/endpoints',
      schemas: 'src/services/api/model',
      client: 'axios',
      mock: false,
    },
    input: {
      target: 'http://localhost:5000/api-json',
    },
  },
};
