var path = require('path');

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        paths: {
            resources: 'src/main/resources/edu/usc/polar'
        },
        watch: {
            js: {
                files: ['<%= paths.resources %>/js/**/*.js', '!<%= paths.resources %>/js/**/*.min.js'],
                tasks: ['concat', 'sass:dev']
            },
            css: {
                files: ['<%= paths.resources %>/css/**/*.css'],
                tasks: ['concat', 'sass:dev']
            },
        }
    });

    grunt.registerTask('style', ['concat', 'sass:dev']);
    grunt.registerTask("server", ["concurrent:server"]);
    grunt.registerTask("api", ["concurrent:api"]);
};