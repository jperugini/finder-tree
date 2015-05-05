/**
* Angular resizable directive with small changes
* https://github.com/Reklino/angular-resizable
*/


(function (angular, undefined) {

	'use strict';

	angular.module('resizable', [])
		.directive('resizable', function () {
			return {
				restrict: 'AE',
				link: function (scope, element, attr) {

					element.addClass('resizable');

					var style = window.getComputedStyle(element[0], null),
						w = parseInt(style.getPropertyValue('width')),
						h = parseInt(style.getPropertyValue('height')),
						dir = scope.$eval(attr.rDirections),
						vx = scope.$eval(attr.rCenteredX) ? 2 : 1, // if centered double velocity
						vy = scope.$eval(attr.rCenteredY) ? 2 : 1, // if centered double velocity
						start,
						dragDir,
						axis;

					if (scope.initW === undefined) {
						scope.initW = parseInt(style.getPropertyValue('width'));
					}


					var drag = function (e) {
						var offset = axis === 'x' ? start - e.clientX : start - e.clientY;
						switch (dragDir) {
						case 'top':
							if (attr.rFlex) {
								element[0].style.flexBasis = h + (offset * vy) + 'px';
							} else {
								element[0].style.height = h + (offset * vy) + 'px';
							}
							break;
						case 'right':
							changeWidth(w - (offset * vx));
							break;
						case 'bottom':
							if (attr.rFlex) {
								element[0].style.flexBasis = h - (offset * vy) + 'px';
							} else {
								element[0].style.height = h - (offset * vy) + 'px';
							}
							break;
						case 'left':
							changeWidth(w + (offset * vx));
							break;
						}
					};

					var changeWidth = function (newW) {
						if (newW > scope.initW) {
							if (attr.rFlex) {
								element[0].style.flexBasis = newW + 'px';
							} else {
								element[0].style.width = newW + 'px';
							}
						}
					};

					var dragStart = function (e, direction) {
						dragDir = direction;
						axis = dragDir === 'left' || dragDir === 'right' ? 'x' : 'y';
						start = axis === 'x' ? e.clientX : e.clientY;

						//prevent transition while dragging
						element.addClass('no-transition');

						document.addEventListener('mouseup', function () {
							document.removeEventListener('mousemove', drag, false);
							w = parseInt(style.getPropertyValue('width'));
							h = parseInt(style.getPropertyValue('height'));
							element.removeClass('no-transition');
						});
						document.addEventListener('mousemove', drag, false);

						// Disable highlighting while dragging
						if (e.stopPropagation) {
							e.stopPropagation();
						}
						if (e.preventDefault) {
							e.preventDefault();
						}
						e.cancelBubble = true;
						e.returnValue = false;
					};

					for (var i = 0; i < dir.length; i++) {
						(function () {
							var grabber = document.createElement('div'),
								direction = dir[i];

							// add class for styling purposes
							grabber.setAttribute('class', 'rg-' + dir[i]);
							grabber.innerHTML = '<span></span>';
							element[0].appendChild(grabber);
							grabber.ondragstart = function () {
								return false;
							};
							grabber.addEventListener('mousedown', function (e) {
								dragStart(e, direction);
							}, false);
						}());
					}

				}
			};
		});

})(angular);