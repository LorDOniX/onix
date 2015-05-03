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
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	// Default task.
	grunt.registerTask('default', ['less:userweb', 'watch:userweb']);
};
