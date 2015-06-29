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
				separator: ''
			},
			dist: {
				src: [
					"static/js/onix/onix.js",
					"static/js/onix/config.js",
					
					"static/js/onix/factory/promise.js",
					"static/js/onix/factory/my-query.js",
					"static/js/onix/service/dom.js",
					"static/js/onix/service/location.js",
					"static/js/onix/service/router.js",
					"static/js/onix/service/provide.js",

					"static/js/onix/service/common.js",
					"static/js/onix/service/notify.js",
					"static/js/onix/factory/events.js",
					"static/js/onix/service/loader.js",

					"static/js/onix/service/http.js",
					"static/js/onix/service/i18n.js",
					
					"static/js/onix/service/templates.js",
					"static/js/onix/factory/page.js",
					"static/js/onix/factory/snippet.js",
					"static/js/onix/factory/select.js"
				],
				dest: 'dist/onix-js-framework.js',
			},

			distEnd: {
				src: [
					"dist/header.txt",
					"dist/onix-js-framework-wh.min.js"
				],
				dest: 'dist/onix-js-framework.min.js',
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/onix-js-framework-wh.min.js': ['dist/onix-js-framework.js']
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['static/js/onix/*.js', 'static/js/onix/*/*.js'],
					options: {
					destination: 'doc'
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsdoc');

	// Default task.
	grunt.registerTask('default', ['less:userweb', 'watch:userweb']);
	grunt.registerTask('dist', ['concat:dist', 'uglify', 'concat:distEnd', 'jsdoc']);
};
