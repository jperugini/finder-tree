(function () {

	angular
		.module('demo', ['finderTree', 'ngDialog'])
		.controller('DemoCtrl', DemoCtrl);

	DemoCtrl.$inject = ['ngDialog'];

	function DemoCtrl(ngDialog) {

		/* jshint validthis: true */
		var vm = this;

		vm.testSelect = {};
		vm.tpltestSelect = {};
		vm.testSelect.itemNumber = 4;

		vm.selectFolder = selectFolder;

		vm.breadcrumbMove = breadcrumbMove;

		vm.newFolder = newFolder;
		vm.newFile = newFile;

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

		vm.hd = angular.copy(vm.hardDrive);

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

		function selectFolder(folder) {
			angular.forEach(vm.listFolder, function (fol) {
				fol.active = undefined;
			});
			folder.active = true;
			vm.tpltestSelect = {};
			vm.selectedFolder = folder;
			vm.tpltestSelect.itemNumber = folder.numberItem;
			vm.tpltestSelect.path = [];
			vm.tpltestSelect.path.push(folder.name);
		};

		selectFolder(vm.listFolder[0]);

		function breadcrumbMove(index) {
			vm.tpltestSelect.manual = true;
			if (angular.isDefined(vm.tpltestSelect.path)) {
				for (var i = vm.tpltestSelect.path.length; i > index; i--) {
					vm.tpltestSelect.path.splice(i, 1);
				}
			}
		};

		function newFolder() {
			openModal(0);
		};

		function newFile() {
			openModal(1);
		};

		function openModal(type) {
			var text;
			var isFolder;
			switch (type) {
			case 0:
				text = 'New Folder';
				isFolder = true;
				break;
			case 1:
				text = 'New File';
				isFolder = false;
				break;
			case 2:
				text = 'Rename';
				break;
			case 3:
				text = 'Delete';
				break;
			default:
				text = 'Error';
				break;
			}
			ngDialog.openConfirm({
				template: 'modalDialogId',
				className: 'ngdialog-theme-default',
				data: {
					type: text
				}
			}).then(function (value) {
				var path = vm.tpltestSelect.path.slice();
				path.shift();
				stepTpPathToCreateItem(vm.selectedFolder.structure, path, value, isFolder, true);
			}, function (reason) {
				// console.log('Modal promise rejected. Reason: ', reason);
			});
		}

		function stepTpPathToCreateItem(data, path, name, isFolder, createItem) {
			if (angular.isDefined(path) && path.length > 0) {
				angular.forEach(data.dirs, function (dir) {
					if (dir.name === path[0]) {
						path.shift();
						if (path.length === 0 && createItem) {
							addItem(dir, name, isFolder);
							createItem = false;
						}
						stepTpPathToCreateItem(dir, path, name, isFolder, createItem);
					}
				});
			} else {
				if (createItem) {
					addItem(data, name, isFolder);
				}
			}
		};

		function addItem(data, name, isFolder) {
			if (isFolder) {
				data.dirs.push({
					name: name,
					dirs: [],
					files: []
				});
			} else {
				data.files.push({
					name: name
				});
			}
		};

	}

})();