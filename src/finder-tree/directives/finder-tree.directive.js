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
			template: '<div style="overflow: auto">' +
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
						if (newValue.manual) {
							scope.$$childHead.resetDisplay(scope.data.dirs);
							stepToPath(scope.data.dirs, newValue.path.slice());
							scope.$$childHead.resetFileDisplay(scope.data);
							var file = {};
							file.path = newValue.path;
							file.itemNumber = scope.itemNumber;
							delete newValue.manual;
							controller.$setViewValue(file);
							controller.$render();
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