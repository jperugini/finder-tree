# Angular FinderTree

Angular Finder Tree is a directive that generate a selectable tree similar to a file explorer.

## Requirements

AngularJS v1.2+

## [Demo](http://jperugini.github.io/finder-tree/)

###Browser support

| Chrome                                | Firefox                               | Safari                                | Opera                                 | IE9+ |
|:-------------------------------------:|:-------------------------------------:|:-------------------------------------:|:-------------------------------------:|:----:|
| ![ok](http://i.imgur.com/CK8qxk1.png) | ![ok](http://i.imgur.com/CK8qxk1.png) | ![ok](http://i.imgur.com/CK8qxk1.png) | ![ok](http://i.imgur.com/CK8qxk1.png) |  ![ok](http://i.imgur.com/CK8qxk1.png)  |

##Install

#### 1. Run the following comand in your termial
```
$ bower install finder-tree --save
```
#### 2. Add the javascript and css files to your index.html
```html
<!DOCTYPE HTML>
<html>
	<head>
		<link href="finder-tree/dist/finder-tree.min.css" rel="stylesheet" type="text/css" />
		</head>
	<body ng-app="app">
  		//.....
  		<script src="finder-tree/dist/finder-tree.min.js"></script>
	</body>
</html>
```
#### 3. Add module dependency in your app.js
```js
angular.module('app', [
  'finderTree'
 ]);
```
#### 4. Call the directive
```html
<finder-tree data="data" ng-model="model" search-filter="search"></finder-tree>
```

## Configuring Finder Tree

### JSON Data

- The JSON data passed to the directive should be a tree of elements:
```
{
	'name': 'MainDir',
	'dirs': [{
		'name': 'SubDir1',
		'dirs': [{
			'name': 'SubSubDir1',
			'dirs': [{...}],
			'files': [{...}]
			}, {
			...
		}],
		'files': [{
				'name': File1'
				}, {
				....
		}]
	}
}
```

- ng-model should be any variable in your controller. The directive will store the selected file and the path to the file.
  - The file can contain any attribut you want, it will be passed to the model when the file is selected.
  - The path is an array containing the list of the folders name in which the file is located.
  
```
{
	'name': 'File1',
	'any other attribute': '',
	'path': ['Array path to file1']
}
```

- search-filter is used to find specific document within any directory of your data. Pass it a string variable and it will filter the element for you.

## Theme
You can edit the default Css file `finder-tree.css` if you want to make a new theme.

## Contributing
Feel free to contribute by forking, opening issues, pull requests etc.

## License
Released under the terms of MIT License.