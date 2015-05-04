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
	  	  'resizable'
//          'ngResource',
//          'ngSanitize'
      ]);

})(angular);

// jshint ignore: start

(function (angular, undefined) {

	'use strict';

	angular.module('resizable', [])
		.directive('resizable', function () {
			return {
				restrict: 'AE',
				link: function (scope, element, attr) {

					element.addClass('resizable');

					var style = window.getComputedStyle(element[0], null),
						w = parseInt(style.getPropertyValue('width')),
						h = parseInt(style.getPropertyValue('height')),
						dir = scope.$eval(attr.rDirections),
						vx = scope.$eval(attr.rCenteredX) ? 2 : 1, // if centered double velocity
						vy = scope.$eval(attr.rCenteredY) ? 2 : 1, // if centered double velocity
						start,
						dragDir,
						axis;

					if (scope.initW === undefined) {
						scope.initW = parseInt(style.getPropertyValue('width'));
					}


					var drag = function (e) {
						var offset = axis === 'x' ? start - e.clientX : start - e.clientY;
						switch (dragDir) {
						case 'top':
							if (attr.rFlex) {
								element[0].style.flexBasis = h + (offset * vy) + 'px';
							} else {
								element[0].style.height = h + (offset * vy) + 'px';
							}
							break;
						case 'right':
							changeWidth(w - (offset * vx));
							break;
						case 'bottom':
							if (attr.rFlex) {
								element[0].style.flexBasis = h - (offset * vy) + 'px';
							} else {
								element[0].style.height = h - (offset * vy) + 'px';
							}
							break;
						case 'left':
							changeWidth(w + (offset * vx));
							break;
						}
					};

					var changeWidth = function (newW) {
						if (newW > scope.initW) {
							if (attr.rFlex) {
								element[0].style.flexBasis = newW + 'px';
							} else {
								element[0].style.width = newW + 'px';
							}
						}
					};

					var dragStart = function (e, direction) {
						dragDir = direction;
						axis = dragDir === 'left' || dragDir === 'right' ? 'x' : 'y';
						start = axis === 'x' ? e.clientX : e.clientY;

						//prevent transition while dragging
						element.addClass('no-transition');

						document.addEventListener('mouseup', function () {
							document.removeEventListener('mousemove', drag, false);
							w = parseInt(style.getPropertyValue('width'));
							h = parseInt(style.getPropertyValue('height'));
							element.removeClass('no-transition');
						});
						document.addEventListener('mousemove', drag, false);

						// Disable highlighting while dragging
						if (e.stopPropagation) {
							e.stopPropagation();
						}
						if (e.preventDefault) {
							e.preventDefault();
						}
						e.cancelBubble = true;
						e.returnValue = false;
					};

					for (var i = 0; i < dir.length; i++) {
						(function () {
							var grabber = document.createElement('div'),
								direction = dir[i];

							// add class for styling purposes
							grabber.setAttribute('class', 'rg-' + dir[i]);
							grabber.innerHTML = '<span></span>';
							element[0].appendChild(grabber);
							grabber.ondragstart = function () {
								return false;
							};
							grabber.addEventListener('mousedown', function (e) {
								dragStart(e, direction);
							}, false);
						}());
					}

				}
			};
		});

})(angular);
(function () {

	angular.module('finderTree.directives')
		.directive('finderTreeWrapped', finderTreeWrapped);


	finderTreeWrapped.$inject = ['$compile', 'RecursionHelper'];

	function finderTreeWrapped($compile, RecursionHelper) {
		return {
			restrict: 'E',
			require: '?^ngModel',
			scope: {
				data: '=',
				level: '=?'
			},
			replace: true,
			transclude: true,
			template: '<div data-ng-show="data.displayed" class="finder-tree">' +
				'<ul resizable r-directions="[\'right\']">' +
				'<li ng-repeat="dir in data.dirs" data-ng-click="displayNext($index)"' +
				'data-ng-class="{\'ft_selected\': dir.selected}">' +
				'<i class="ft_folder"></i>' +
				'<span class="ft_span_text">{{dir.name}}</span>' +
				'<i data-ng-class="dir.selected ? \'ft_caret_right_selected\' : \'ft_caret_right\'"></i></li>' +
				'<li ng-repeat="file in data.files" data-ng-click="select(file, $index)"' +
				'data-ng-class="{\'ft_selected\': file.selected}"><i class="ft_file"></i>' +
				'<span class="ft_span_text_file">{{file.name}}</span></li>' +
				'</ul>' +
				'<finder-tree-wrapped ng-repeat="dir in data.dirs" data="dir" level="level"></finder-tree-wrapped>' +
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

					scope.displayNext = function (index) {
						scope.resetDisplay(scope.data.dirs, index);
						scope.resetFileDisplay();
						scope.data.dirs[index].displayed = true;
						scope.data.dirs[index].selected = true;
						// Set the path
						var path = scope.getPath();
						// Push current dir
						path.push(scope.data.dirs[index].name);
						// Number of item in current dir
						var itemNumber = scope.data.dirs[index].dirs.length + scope.data.dirs[index].files.length;
						var file = {};
						file.path = path;
						file.itemNumber = itemNumber;
						controller.$setViewValue(file);
						controller.$render();
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
						var path = scope.getPath();
						file.path = path;
						// Number of item in current dir
						var itemNumber = scope.data.dirs.length + scope.data.files.length;
						file.itemNumber = itemNumber;
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
						if (targetScope.hasOwnProperty('data')) {
							if (targetScope.data.hasOwnProperty('name')) {
								path.push(targetScope.data.name);
							}
						}
						if (targetScope.$parent.hasOwnProperty('level')) {
							while (targetScope.$parent.level >= 0) {
								targetScope = targetScope.$parent;
								if (targetScope.hasOwnProperty('data')) {
									path.push(targetScope.data.name);
								}
							}
						}
						return path.reverse();
					};

					scope.$watch('data', function (newV, oldV) {
						scope.resetDisplay(oldV.dirs);
						scope.data = newV;
						if (scope.level === 0) {
							scope.data.displayed = true;
						}
					});

				});
			}
		};
	}

})();
(function () {

	angular.module('finderTree.directives')
		.directive('finderTree', finderTree);

	finderTree.$inject = ['$filter'];

	function finderTree($filter) {
		return {
			restrict: 'E',
			require: '?^ngModel',
			scope: {
				data: '=',
				searchFilter: '=?',
				dataModel: '=ngModel'
			},
			transclude: true,
			replace: true,
			template: '<div>' +
				'<finder-tree-wrapped data="data" ng-model="dataModel" data-ng-hide="searchFilter" data-ng-transclude>' +
				'</finder-tree-wrapped>' +
				'<div class="finder-tree" data-ng-if="searchFilter"><ul resizable r-directions="[\'right\']">' +
				'<li data-ng-repeat="file in allFiles | filter:filterOnName(searchFilter) track by $index"' +
				'data-ng-click="selectFile(file)"' +
				'data-ng-class="{\'ft_selected\': file.selected}"><i class="ft_file"></i>' +
				'<span class="ft_span_text_file">{{file.name}}</span></li>' +
				'<li data-ng-if="filteredFiles.length ===0">' +
				'<span class="ft_span_text_nomatch">No file found for "{{searchFilter}}"</span></li></ul></div>' +
				'</div>',
			link: function (scope, element, attrs, controller) {
				scope.allFiles = [];
				getAllFiles(scope.data);

				scope.selectFile = function (file, filesNumber) {
					scope.clearSelectedFiles();
					file.selected = true;
					// Number of item in current dir
					file.itemNumber = filesNumber;
					controller.$setViewValue(file);
					controller.$render();
				};

				scope.filterOnName = function (req) {
					var query = {};
					query.name = req;
					return query;
				};

				scope.$watch('searchFilter', function (newV, oldV) {
					var file = {};
					if (angular.isDefined(newV)) {
						if (newV.length > 0) {
							var filter = scope.filterOnName(newV);
							var filteredList = $filter('filter')(scope.allFiles, filter);
							file.itemNumber = filteredList.length;
							controller.$setViewValue(file);
							controller.$render();
						} else if (newV.length === 0) {
							// Reset display when clear search
							scope.$$childHead.resetDisplay(scope.data.dirs);
							file.itemNumber = scope.data.dirs.length + scope.data.files.length;
							controller.$setViewValue(file);
							controller.$render();
						}
					}
				});

				// Watch change of ngModel
				scope.$watch(
					function () {
						return controller.$modelValue;
					},
					function (newValue, oldValue) {
						if (angular.isDefined(newValue)) {
							// Check for path change (example: breadcrumb, ...)
							if (newValue.manual) {
								// Get function from child scope to reset display
								scope.$$childHead.resetDisplay(scope.data.dirs);
								// Remove first item of the path to step in the tree
								var pathToStep = newValue.path.slice();
								pathToStep.shift();
								stepToPath(scope.data.dirs, pathToStep);
								scope.$$childHead.resetFileDisplay(scope.data);
								var file = {};
								file.path = newValue.path;
								file.itemNumber = scope.itemNumber || scope.data.dirs.length + scope.data.files.length;
								delete newValue.manual;
								controller.$setViewValue(file);
								controller.$render();
							}
						}
					}, true);

				// Watch for data change
				scope.$watch('data', function (newV, oldV) {
					if (angular.isDefined(newV)) {
						scope.allFiles = [];
						getAllFiles(newV);
					}
				});

				function stepToPath(dirs, path) {
					if (angular.isDefined(path) && path.length > 0) {
						angular.forEach(dirs, function (dir) {
							if (dir.name === path[0]) {
								dir.displayed = true;
								dir.selected = true;
								path.shift();
								if (path.length === 0) {
									scope.itemNumber = dir.dirs.length + dir.files.length;
								}
								stepToPath(dir.dirs, path);
							}
						});
					}
				}

				scope.clearSelectedFiles = function () {
					angular.forEach(scope.allFiles, function (file) {
						file.selected = false;
					});
				};

				function getAllFiles(data, path) {
					if (!angular.isDefined(path)) {
						path = [];
					}
					angular.forEach(data.files, function (file) {
						file.path = path.slice();
						scope.allFiles.push(file);
					});
					angular.forEach(data.dirs, function (dir) {
						path.push(dir.name);
						getAllFiles(dir, path);
					});
				}
			}
		};
	}

})();
(function () {

	angular.module('finderTree.filters')
		.filter('ftFilter', ftFilter);


	function ftFilter() {
		return function(item) {
			return item;
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