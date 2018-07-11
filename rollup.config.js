export default {
  input: 'src/lane/index.js',
  output: {
    name: 'Lane',
    file: 'dist/lane.js',
    format: 'iife',
    sourceMap: 'inline',
    globals: {
      'date-fns': 'dateFns'
    },
  },
  external: ['date-fns'],
};
