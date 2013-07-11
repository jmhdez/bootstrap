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

				var touchBoundary = 15;
				var tapping = false;
				var touchStartX = 0;
				var touchStartY = 0;

				element.bind('touchstart', function(e) {

					// Extraigo el evento original del evento que me manda jQuery
					var event = e.originalEvent;

					// Si hay más de un dedo a la vez, no hago nada
					if (event.targetTouches.length > 1) {
						return;
					}

					tapping = true;
					touchStartX = event.targetTouches[0].pageX;
					touchStartY = event.targetTouches[0].pageY;

				});

				element.bind('touchcancel', function(e) {
					tapping = false;
					touchStartX = 0;
					touchStartY = 0;
				});

				element.bind('touchend', function(e) {

					if (!tapping) {
						return;
					}

					var touch = e.originalEvent.changedTouches[0],
						touchEndX = touch.pageX,
						touchEndY = touch.pageY;

					if (Math.abs(touchEndX - touchStartX) > touchBoundary || Math.abs(touchEndY - touchStartY) > touchBoundary) {
						return;
					}

					scope.$apply(attrs['ngTap'], element);
					
				});

			}
		};
	}
]);