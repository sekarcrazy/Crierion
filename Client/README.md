# NIS UI device maintenance using Angular


This is a project template for Angular JS applications

It includes the following features:

1. [Bower plugin]
2. [Grunt plugin]
4. Extensive exception handling.
5. coffee precompilation into js using grunt-contrib-coffee
6. html,image,css and js file will be minified using grunt-contrib-uglify
7. [Resource] Server communication by angular resource.
8. Template Precompilation into Angulars $templateCache using `grunt-angular-templates`
9. [Unit Tests](http://karma-runner.github.io/0.12/index.html)
10. Automated deployment and unit testing by grunt.
11. Self hosting using NodeJs express and body-parser.

# Installation Instructions

	npm is a NodeJS package manager.

1. `$ cd yourapp`
2. `$ sudo npm install -g grunt-cli`
3. `$ sudo npm install -g bower`
4. `$ npm install`
5. `$ bower install`
6. `$ grunt build

# App files
`app/`:
* *css*	- add app level LESS files here. `@import` them into the `style.less` file
* *img* - add images here 
* *js* - add angularJS files here
* *js/**/template - add template files here. each module has own template.
* *index_production.html' -- will be converted to the main index.html with necessary script file added.

`vendor/`:
* *css*	- `@import` vendor / bower LESS or CSS files in the `vendor.less` file
* *img* - add vendor specific images
* *lib.js* - add vendor js files that are not bower modules here

## Generate source file

run the below command
1. go to the directory where you have Gruntfile.js
2. 'grunt build'

## Modify Application Files once build is done.

The following changes should be made in the *config/config.js* file:
1. Line 3:20_:   Replace nisApiBaseUrl value with "NIS API" url

## Modify port if the server is running on 9000 port.

The following changes should be made in the server.js file:
1. Line 17:17_:    change the port.

## Modify domain name(localhost) to avoid cross domain issues.

The following changes should be made in the server.js file:

1. Line 17:17_:    http.listen(9000, 'domain name')-- ex: http.listen(9000, '121.0.0.1')

## Toggling page header
The following changes should be made in the *config/config.js* file:
1. Line 9:20_:   showHeader:true/false

## Run

1. make sure you followed installation steps.
2. make sure the API url is confgured properly.
3. go to that directory where you have server.js file
3. `$ node server
4. it will listen to localhost with port 9000.(http://localhost:9000/#/)

## Tests

Unit test files should be placed in the `test/unit` folder.  You can create subfolders to organize tests

To run the unit tests:

1. grunt unit - this will launch Testem and execute specs in Chrome

# Deploy

## Production
1. Manually run 'grunt production' it will give minified files.

