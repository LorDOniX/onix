module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			userweb: {
				files: ["static/css/*.less"],
				tasks: ['less:userweb']
			}
		},
		
		less: {
			userweb: {
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
					"static/js/onix/onix.js",
					"static/js/onix/config.js",

					"static/js/onix/service/routeParams.js",
					"static/js/onix/factory/_promise.js",
					"static/js/onix/factory/promise.js",
					"static/js/onix/factory/_my-query.js",
					"static/js/onix/factory/my-query.js",
					"static/js/onix/service/dom.js",
					"static/js/onix/service/location.js",
					"static/js/onix/service/provide.js",

					"static/js/onix/service/common.js",
					"static/js/onix/factory/_notify.js",
					"static/js/onix/service/notify.js",
					"static/js/onix/factory/event.js",
					"static/js/onix/service/loader.js",

					"static/js/onix/service/http.js",
					"static/js/onix/service/i18n.js",

					"static/js/onix/service/template.js",
					"static/js/onix/service/route.js",
					"static/js/onix/factory/select.js"
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
				src: ['static/js/onix/*.js', 'static/js/onix/*/*.js'],

				dest: 'docs',

				// extra options
				options: {
					'builtin-classes': true,
					'warnings': ['-no_doc', '-dup_member', '-link_ambiguous'],
					'external': ['XMLHttpRequest']
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
	grunt.registerTask('default', ['less:userweb', 'watch:userweb']);
	grunt.registerTask('dist', ['concat:dist', 'uglify', 'concat:distEnd', 'jsduck']);
};
