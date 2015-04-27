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
			template: '<div><finder-tree-wrapped data="data" ng-model="dataModel" data-ng-transclude></finder-tree-wrapped>' +
			'<p class="ft_clear"></p><div>'
		};
	}

})();