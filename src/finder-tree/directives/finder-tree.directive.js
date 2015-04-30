(function () {

	angular.module('finderTree.directives')
		.directive('finderTree', finderTree);

	function finderTree() {
		return {
			restrict: 'E',
			require: '?^ngModel',
			scope: {
				data: '=',
				dataModel: '=ngModel'
			},
			transclude: true,
			replace: true,
			template: '<div style="overflow: auto; white-space: nowrap;">' +
				'<finder-tree-wrapped data="data" ng-model="dataModel" data-ng-transclude></finder-tree-wrapped>' +
				'</div>',
			link: function (scope, element, attrs, controller) {

				// Watch change of ngModel
				scope.$watch(
					function () {
						return controller.$modelValue;
					},
					function (newValue, oldValue) {
						if (angular.isDefined(oldValue.path) && angular.isDefined(newValue.path)) {
							if (oldValue.path.length > newValue.path.length) {
								scope.$$childHead.resetDisplay(scope.data.dirs);
								stepToPath(scope.data.dirs, newValue.path.slice());
								if (newValue.name === oldValue.name) {
									scope.$$childHead.resetFileDisplay(scope.data);
									var file = {};
									file.path = newValue.path;
									file.itemNumber = scope.itemNumber;
									controller.$setViewValue(file);
									controller.$render();
								}
							}
						}
					}, true);

				function stepToPath(dirs, path) {
					if (angular.isDefined(path) && path.length > 0) {
						angular.forEach(dirs, function (dir) {
							if (dir.name === path[0]) {
								dir.displayed = true;
								dir.selected = true;
								path.shift();
								if(path.length === 0) {
									scope.itemNumber = dir.dirs.length + dir.files.length;
								}
								stepToPath(dir.dirs, path);
							}
						});
					}
				}
			}
		};
	}

})();