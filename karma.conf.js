module.exports = function(config) {
  config.set({
    files: [
      'lib/date_fns.min.js',
      { pattern: 'test/**/*.spec.js', watched: true },
    ],
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    preprocessors: {
      './test/**/*.js': ['rollup']
    },
    rollupPreprocessor: {
      plugins: [
        // require('rollup-plugin-buble')(),
      ],
      output: {
        name: 'Lane',
        format: 'iife',
        sourceMap: 'inline',
        globals: {
          'date-fns': 'dateFns'
        },
      },
      external: ['date-fns'],
    },
    singleRun: false,
    autoWatch: true,
    colors: true,
    logLevel: config.LOG_INFO,
    reporters: ['progress'],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  })
};
