module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            // Cargamos nuestros tests
            'src/**/*.spec.js'
        ],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        // IMPORTANTE: Usamos ChromeHeadless para que funcione en servidores o entornos sin pantalla
        browsers: ['ChromeHeadless'],
        singleRun: true,
        concurrency: Infinity
    })
}
