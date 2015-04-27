(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('finderTree.config', [])
      .value('finderTree.config', {
          debug: true
      });

  // Modules
  angular.module('finderTree.directives', []);
  angular.module('finderTree.filters', []);
  angular.module('finderTree.services', []);
  angular.module('finderTree',
      [
          'finderTree.config',
          'finderTree.directives',
          'finderTree.filters',
          'finderTree.services',
	  	  'RecursionHelper'
//          'ngResource',
//          'ngSanitize'
      ]);

})(angular);
