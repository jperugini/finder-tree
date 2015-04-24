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
				'data-ng-class="{\'selected\': dir.selected}"><i class="tf_folder"></i>{{dir.name}} >' +
				'</li>' +
				'<li ng-repeat="file in data.files" data-ng-click="select(file, $index)"' +
				'data-ng-class="{\'selected\': file.selected}"><i class="tf_file"></i>{{file.name}}</li>' +
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
						var path = scope.getPath();
						path.push(file.name);
						file.path = path;
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