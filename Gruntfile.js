/**
 * Created by stevencarter on 29/07/2016.
 *
 *
 *
 Commands are:
 grunt default - lint and test it all
 grunt test - run the tests
 grunt jshint - lint the code

 */
module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: './.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: [
        './*.js',
        './test/*.spec.js'
      ]
    },

    /* This is used to set our environment variables NODE_ENV and DEBUG.
     */
    env: {
      test: {
        NODE_ENV: 'test',
        DEBUG: 'sra:*'
      }
    },

    // Test settings
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.spec.js']
      }
    }
  });


  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);

  grunt.registerTask('test', function(target) {
    if (true || target === 'unit') {
      return grunt.task.run([
        'env',
        'mochaTest'
      ]);
    }
  });
  // Add the grunt-mocha-test tasks.
/*
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
*/

};