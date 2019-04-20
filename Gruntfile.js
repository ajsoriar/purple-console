'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['dist/*.*']
            }
        },
        copy: {
            build: {
                files: [{
                    cwd: 'src',
                    src: [
                        '*.js'
                    ],
                    dest: 'dist',
                    expand: true
                }
                ]
            }
        },
        uglify: {
            options: {
                preserveComments: 'some', // will preserve all comments that start with a bang (!) or include a closure compiler style directive (@preserve)
                mangle: false, // false to prevent changes to your variable and function names.
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    'dist/purple-console.min.js': ['dist/purple-console.js']
                }
            },
        },
        remove_comments: {
            js: {
                options: {
                    multiline: true,
                    singleline: true,
                    keepSpecialComments: false
                },
                cwd: 'dist',
                src: 'purple-console.js',
                expand: true,
                dest: 'dist'
            }
        },
        concat: {
            options: {
              //separator: ';',
            },
            dist: {
              src: ['src/header.txt', 'dist/purple-console.js'],
              dest: 'dist/purple-console.js',
            },
          },

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-remove-comments');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask( 
        'build',
        'Compiles all of the assets and files to dist directory.',
        ['clean', 'copy', 'remove_comments:js', 'concat', 'uglify' ]
    );

};
