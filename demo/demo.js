(function () {

	angular
		.module('demo', ['finderTree'])
		.controller('DemoCtrl', DemoCtrl);

	function DemoCtrl() {

		/* jshint validthis: true */
		var vm = this;

		vm.testSelect = {}
		vm.testSelect.itemNumber = 4;

		vm.selectFolder = selectFolder;

		vm.breadcrumbMove = breadcrumbMove;

		vm.hardDrive = {
			'name': 'Hard Drive',
			'dirs': [
				{
					'name': 'Hello',
					'dirs': [{
							'name': 'Hello/sub',
							'dirs': [{
								'name': 'Hello/sub1',
								'dirs': [],
								'files': [{
									'name': 'Hello/Sub1'
								}]
						}],
							'files': [{
								'name': 'Hello/Sub1'
							}]
						},
						{
							'name': 'Hello/sub2',
							'dirs': [],
							'files': [{
								'name': 'Very very very long Hello/Sub2'
							}]
						}],
					'files': [{
						'name': 'Hello/1'
					}, {
						'name': 'Hello/2'
					}]
				}, {
					'name': 'Test',
					'dirs': [],
					'files': [{
						'name': 'Test/1'
					}, {
						'name': 'Test/2'
					}]
				},
				{
					'name': 'Very very very long Hello',
					'dirs': [{
						'name': 'Hello/sub',
						'dirs': [],
						'files': [{
							'name': 'Hello/Sub1'
						}]
						}],
					'files': [{
						'name': 'Hello/1'
					}]
				}
			],
			'files': [{
				'name': 'Hello/Sub1'
			}]
		};

		vm.homeFolder = {
			'name': 'Home',
			'dirs': [
				{
					'name': 'Documents',
					'dirs': [{
							'name': 'Hello/sub',
							'dirs': [{
								'name': 'Hello/sub',
								'dirs': [],
								'files': [{
									'name': 'Hello/Sub1'
								}]
						}],
							'files': [{
								'name': 'Hello/Sub1'
							}]
						},
						{
							'name': 'Hello/sub',
							'dirs': [],
							'files': [{
								'name': 'Very very very long Hello/Sub2'
							}]
						}],
					'files': [{
						'name': 'Hello/1'
					}, {
						'name': 'Hello/2'
					}]
				}, {
					'name': 'Pictures',
					'dirs': [],
					'files': [{
						'name': 'Test/1'
					}, {
						'name': 'Test/2'
					}]
				},
				{
					'name': 'Videos',
					'dirs': [{
						'name': 'Hello/sub',
						'dirs': [],
						'files': [{
							'name': 'Hello/Sub1'
						}]
						}],
					'files': [{
						'name': 'Hello/1'
					}]
				},
				{
					'name': 'finder-tree',
					'dirs': [{
						'name': 'Hello/sub',
						'dirs': [],
						'files': [{
							'name': 'Hello/Sub1'
						}]
						}],
					'files': [{
						'name': 'Hello/1'
					}]
				}
			],
			'files': [{
				'name': 'home-script.sh'
			}]
		};

		vm.listFolder = [{
			'name': "Hard Drive",
			'img': "img/hd.png",
			'numberItem': 4,
			'structure': vm.hardDrive
		}, {
			'name': "Home",
			'img': "img/home.png",
			'numberItem': 5,
			'structure': vm.homeFolder
		}];

		vm.listFolder[0].active = true;

		function selectFolder(folder) {
			angular.forEach(vm.listFolder, function (folder) {
				folder.active = undefined;
			});
			folder.active = true;
			vm.testSelect = {};
			vm.selectedFolder = folder;
			vm.testSelect.itemNumber = folder.numberItem;
		};

		function breadcrumbMove(index) {
			vm.testSelect.manual = true;
			if (angular.isDefined(vm.testSelect.path)) {
				for (var i = vm.testSelect.path.length; i > index; i--) {
					vm.testSelect.path.splice(i, 1);
				}
			}
		};
		
	}

})();