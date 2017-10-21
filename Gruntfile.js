module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.initConfig({
        requirejs: {
            dist: {
                "options": {
                    appDir: "src/",
                    baseUrl: ".",
                    dir: "dist/",
                    optimize: "uglify2",
                    modules: [
                        {name: "pre-loader"}
                    ],
                    removeCombined: true,
                    logLevel: 0,
                    findNestedDependencies: true,
                    inlineText: true,
                    fileExclusionRegExp: /(node_modules|bower_components)/
                }
            }
        }
    });

    grunt.registerTask('dist', ['requirejs']);
};