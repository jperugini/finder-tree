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