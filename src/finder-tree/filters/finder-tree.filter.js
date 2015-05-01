(function () {

	angular.module('finderTree.filters')
		.filter('ftFilter', ftFilter);


	function ftFilter() {
		return function(item) {
			return item;
		};
	}

})();