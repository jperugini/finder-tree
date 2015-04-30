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
						return controller.$modelValue.path;
					},
					function (newValue, oldValue) {
						if (angular.isDefined(oldValue) && angular.isDefined(newValue)) {
							if (oldValue.length > newValue.length) {
								scope.$$childHead.resetDisplay(scope.data.dirs);
								stepToPath(scope.data.dirs, newValue.slice());
							}
						}
					}, true);

				function stepToPath(dirs, path) {
					if (angular.isDefined(path) && path.length > 0) {
						angular.forEach(dirs, function (dir) {
							if (dir.name === path[0]) {
								dir.displayed = true;
								path.shift();
								stepToPath(dir.dirs, path);
							}
						});
					}
				}
			}
		};
	}

})();