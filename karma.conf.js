module.exports = function(config) {
  config.set({
    files: [{ pattern: 'test/**/*.spec.js', watched: true }],
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
        format: 'iife',
        name: 'Vue',
        sourcemap: 'inline'
      }
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
