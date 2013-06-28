angular.module('ui.bootstrap.tap', [])

.directive('ngTap', ['$window',
	function($window) {

		// En los teléfonos se usa 'tap' para ir más rápido,
		// pero en PCs no existe, así que uso click.
		// La forma "buena" de detectarlo es con feature detection
		// pero en algunos tablets con android 4.1 no funciona bien, 
		// así que recurro al UA y asumo que si es android, es touch

		var isTapDevice = $window.hasOwnProperty('ontouchstart') || $window.navigator.userAgent.match(/android/i);

		return function(scope, element, attrs) {

			if (!isTapDevice) {
				
				element.bind('click', function() {
					scope.$apply(attrs['ngTap'], element);	
				});

			} else {

				var tapping = false;

				element.bind('touchstart', function(e) {
					tapping = true;
				});
				element.bind('touchmove', function(e) {
					tapping = false;
				});
				element.bind('touchend', function(e) {
					if (tapping) {
						scope.$apply(attrs['ngTap'], element);
					}
				});
			}
		};
	}
]);