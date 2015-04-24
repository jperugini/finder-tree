(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('finderTree.config', [])
      .value('finderTree.config', {
          debug: true
      });

  // Modules
  angular.module('finderTree.directives', []);
  angular.module('finderTree.filters', []);
  angular.module('finderTree.services', []);
  angular.module('finderTree',
      [
          'finderTree.config',
          'finderTree.directives',
          'finderTree.filters',
          'finderTree.services',
	  	  'RecursionHelper',
//          'ngResource',
//          'ngSanitize'
      ]);

})(angular);

(function () {

	angular.module('finderTree.directives')
		.directive('finderTree', finderTree);


	finderTree.$inject = ['$compile', 'RecursionHelper'];

	function finderTree($compile, RecursionHelper) {
		return {
			restrict: 'E',
			require: '?^ngModel',
			scope: {
				data: '=',
				level: '=?'
			},
			replace: true,
			template: '<div data-ng-show="data.displayed"><ul style="float: left;">' +
				'<li ng-repeat="dir in data.dirs" data-ng-click="displayNext($index)"' +
				'data-ng-class="{\'selected\': dir.selected}">* {{dir.name}} >' +
				'</li>' +
				'<li ng-repeat="file in data.files" data-ng-click="select(file, $index)"' +
				'data-ng-class="{\'selected\': file.selected}">- {{file.name}}</li>' +
				'</ul>' +
				'<finder-tree ng-repeat="dir in data.dirs" data="dir" level="level"></finder-tree>' +
				'</div>',
			compile: function (element) {
				return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
					// Define your normal link function here.
					// Alternative: instead of passing a function,
					// you can also pass an object with 
					// a 'pre'- and 'post'-link function.

					scope.$watch('level', function (val) {
						if (val === 0) {
							scope.data.displayed = true;
						}
					});

					if (!angular.isDefined(scope.level)) {
						scope.level = 0;
					} else {
						scope.level = scope.level + 1;
					}

					if (scope.level === undefined) {
						scope.data.displayed = true;
					}

					scope.displayNext = function (index) {
						scope.resetDisplay(scope.data.dirs, index);
						scope.resetFileDisplay();
						scope.data.dirs[index].displayed = true;
						scope.data.dirs[index].selected = true;
					};

					scope.resetDisplay = function (objectToReset, index) {
						if (index === undefined || !scope.data.dirs[index].selected) {
							angular.forEach(objectToReset, function (object) {
								object.selected = false;
								object.displayed = false;
								scope.resetDisplay(object.dirs, index);
							});
						}
					};

					scope.resetFileDisplay = function (objectToReset) {
						if (objectToReset === undefined) {
							objectToReset = scope.getHighestDirectiveScope().data;
						}
						// Reset Files in directories
						angular.forEach(objectToReset.dirs, function (dir) {
							angular.forEach(dir.files, function (file) {
								file.selected = false;
							});
							scope.resetFileDisplay(dir);
						});
						// Reset standalone Files
						angular.forEach(objectToReset.files, function (file) {
							file.selected = false;
						});
					};

					scope.select = function (file, index) {
						scope.resetFileDisplay();
						scope.resetDisplay(scope.data.dirs);
						scope.data.files[index].selected = true;
						file.path = scope.getPath();
						controller.$setViewValue(file);
						controller.$render();
					};

					scope.getHighestDirectiveScope = function () {
						var targetScope = this;
						if (targetScope.$parent.hasOwnProperty('level')) {
							while (targetScope.$parent.level !== 0) {
								targetScope = targetScope.$parent;
							}
							return targetScope.$parent;
						} else {
							return this;
						}
					};

					scope.getPath = function () {
						var targetScope = this;
						var path = [];
						path.push(targetScope.data.name);
						if (targetScope.$parent.hasOwnProperty('level')) {
							while (targetScope.$parent.level !== 0) {
								targetScope = targetScope.$parent;
								if (targetScope.hasOwnProperty('data')) {
									path.push(targetScope.data.name);
								}
							}
						}
						return path.reverse();
					};
				});
			}
		};
	}

})();
(function () {

	angular.module('finderTree.filters')
		.filter('filterLevel', filterLevel);


	function filterLevel() {
		return function(level) {
			if(level !== undefined) {
				return level+1;
			}
		};
	}

})();
/* 
 * An Angular service which helps with creating recursive directives.
 * @author Mark Lagendijk
 * @license MIT
 */
angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function($compile){
	return {
		/**
		 * Manually compiles the element, fixing the recursion loop.
		 * @param element
		 * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
		 * @returns An object containing the linking functions.
		 */
		compile: function(element, link){
			// Normalize the link parameter
			if(angular.isFunction(link)){
				link = { post: link };
			}

			// Break the recursion loop by removing the contents
			var contents = element.contents().remove();
			var compiledContents;
			return {
				pre: (link && link.pre) ? link.pre : null,
				/**
				 * Compiles and re-adds the contents
				 */
				post: function(scope, element){
					// Compile the contents
					if(!compiledContents){
						compiledContents = $compile(contents);
					}
					// Re-add the compiled contents to the element
					compiledContents(scope, function(clone){
						element.append(clone);
					});

					// Call the post-linking function, if any
					if(link && link.post){
						link.post.apply(null, arguments);
					}
				}
			};
		}
	};
}]);