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
			link: function(scope, element, attrs) {
				scope.$watch('data', function(newV, oldV) {
					scope.data = newV;
				});
			}
		};
	}

})();