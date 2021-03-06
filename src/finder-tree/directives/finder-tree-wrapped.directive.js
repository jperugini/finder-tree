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