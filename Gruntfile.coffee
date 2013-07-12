module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    clean:
      js: [ "public/js/*", "!public/js/vendor" ]
      css: [ "public/css/*", "!public/css/vendor" ]

    coffee:
      options:
        sourceMap: true

      main:
        expand: true
        cwd: "src"
        src: "**/*.coffee"
        dest: "public/js"
        ext: ".js"

    handlebars:
      options:
        processName: (name) ->
          name.split('/')[1..].join('/').replace /\.hbs$/, ""
        amd: true

      main:
        src: "templates/**/*.hbs"
        dest: "public/js/templates.js"

    stylus:
      main:
        expand: true
        cwd: "styl"
        src: "**/*.styl"
        dest: "public/css"
        ext: ".css"

    coffeelint:
      options:
        no_tabs: level: "error"
        no_trailing_whitespace: level: "error", allowed_in_comments: false
        max_line_length: value: 80, level: "warn"
        camel_case_classes: level: "error"
        indentation: value: 2, level: "error"
        no_implicit_braces: level: "ignore"
        no_trailing_semicolons: level: "error"
        no_plusplus: level: "warn"
        no_throwing_strings: level: "error"
        cyclomatic_complexity: value: 10, level: "ignore"
        no_backticks: level: "ignore"
        line_endings: level: "warn", value: "unix"
        no_implicit_parens: level: "ignore"
        empty_constructor_needs_parens: level: "ignore"
        non_empty_constructor_needs_parens: level: "ignore"
        no_empty_param_list: level: "warn"
        space_operators: level: "ignore"
        duplicate_key: level: "error"
        newlines_after_classes: value: 3, level: "warn"
        no_stand_alone_at: level: "warn"
        arrow_spacing: level: "warn"
        coffeescript_error: level: "error"
      src: [ "src/*.coffee", "src/**/*.coffee" ]
      root: "*.coffee"

    watch:
      coffee:
        files: "src/**/*.coffee"
        tasks: [ "coffeelint:src", "coffee:main" ]
      stylus:
        files: "styl/**/*.styl"
        tasks: "stylus:main"
      handlebars:
        files: "templates/**/*.hbs"
        tasks: "handlebars:main"
      root:
        files: "*.coffee"
        tasks: "coffeelint:root"

    build:
      main:
        tasks: [
          "coffee:main"
          "handlebars:main"
          "stylus:main"
        ]

  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-handlebars"

  grunt.registerMultiTask "build", "Build project files", ->
    grunt.task.run @data.tasks

  grunt.registerTask "default", [ "clean", "coffeelint", "build" ]
