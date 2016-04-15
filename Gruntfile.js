module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			css: {
				files: ["static/css/*.less"],
				tasks: ['less:css']
			},
			
			js: {
				files: ["src/*.js"],
				tasks: ['concat:dist']
			}
		},
		
		less: {
			css: {
				files: {
					"static/css/main.css": "static/css/main.less"
				}
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					"src/polyfills.js",
					"src/exif.js",
					"src/onix.js",
					"src/config.js",
					"src/localstorage.js",
					"src/promise.js",
					"src/job.js",
					"src/my-query.js",
					"src/dom.js",
					"src/location.js",
					"src/common.js",
					"src/notify.js",
					"src/event.js",
					"src/loader.js",
					"src/http.js",
					"src/i18n.js",
					"src/template.js",
					"src/select.js"
				],

				dest: 'dist/onix-js-framework.js',
			},

			distEnd: {
				src: [
					"HEADER",
					"tmp/onix-js-framework.min.js"
				],

				dest: 'dist/onix-js-framework.min.js',
			}
		},

		uglify: {
			dist: {
				files: {
					'tmp/onix-js-framework.min.js': ['dist/onix-js-framework.js']
				}
			}
		},

		jsduck: {
			dist: {
				src: ['src/*.js'],

				dest: 'docs',

				// extra options
				options: {
					'builtin-classes': false,
					'warnings': ['-nodoc', '-dup_member', '-link_ambiguous'],
					'external': ['XMLHttpRequest', '$q']
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsduck');

	// Default task.
	grunt.registerTask('default', ['less:css', 'watch:css']);
	grunt.registerTask('dev', ['less:css', 'concat:dist', 'watch']);
	grunt.registerTask('dist', ['concat:dist', 'uglify', 'concat:distEnd', 'jsduck']);
};
