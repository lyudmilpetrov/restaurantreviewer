﻿'use strict';
$(document).ready(function () {
    $('.nav').setup_navigation();
});
$(function(){
	$('.nav').setup_navigation();
});
var keyCodeMap = {
    48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 59: ";",
    65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l",
    77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z",
    96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9"
};
$.fn.setup_navigation = function (settings) {
    settings = jQuery.extend({
        menuHoverClass: 'show-menu',
    }, settings);
    // Add ARIA role to menubar and menu items
    $(this).attr('role', 'menubar').find('li').attr('role', 'menuitem');
        var top_level_links = $(this).find('> li > a');
    // Added by Terrill: (removed temporarily: doesn't fix the JAWS problem after all)
    // Add tabindex="0" to all top-level links
    // Without at least one of these, JAWS doesn't read widget as a menu, despite all the other ARIA
    //$(top_level_links).attr('tabindex','0');

    // Set tabIndex to -1 so that top_level_links can't receive focus until menu is open
    $(top_level_links).next('ul')
		.attr('data-test', 'true')
		.attr({ 'aria-hidden': 'true', 'role': 'menu' })
		.find('a')
			.attr('tabIndex', -1);

     //Adding aria-haspopup for appropriate items
    $(top_level_links).each(function () {
        if ($(this).next('ul').length > 0)
            $(this).parent('li').attr('aria-haspopup', 'true');
    });

    $(top_level_links).hover(function () {
        $(this).closest('ul')
			.attr('aria-hidden', 'false')
			.find('.' + settings.menuHoverClass)
				.attr('aria-hidden', 'true')
				.removeClass(settings.menuHoverClass)
				.find('a')
					.attr('tabIndex', -1);
        $(this).next('ul')
			.attr('aria-hidden', 'false')
			.addClass(settings.menuHoverClass)
			.find('a').attr('tabIndex', 0);
    });
    $(top_level_links).focus(function () {
        $(this).closest('ul')
			// Removed by Terrill
			// The following was adding aria-hidden="false" to root ul since menu is never hidden
			// and seemed to be causing flakiness in JAWS (needs more testing)
			// .attr('aria-hidden', 'false')
			.find('.' + settings.menuHoverClass)
				.attr('aria-hidden', 'true')
				.removeClass(settings.menuHoverClass)
				.find('a')
					.attr('tabIndex', -1);
        $(this).next('ul')
			.attr('aria-hidden', 'false')
			.addClass(settings.menuHoverClass)
			.find('a').attr('tabIndex', 0);
    });

    // Bind arrow keys for navigation
    $(top_level_links).keydown(function (e) {
        if (e.keyCode == 37) {
            e.preventDefault();
            // This is the first item
            if ($(this).parent('li').prev('li').length == 0) {
                $(this).parents('ul').find('> li').last().find('a').first().focus();
            } else {
                $(this).parent('li').prev('li').find('a').first().focus();
            }
        } else if (e.keyCode == 38) {
            e.preventDefault();
            if ($(this).parent('li').find('ul').length > 0) {
                $(this).parent('li').find('ul')
					.attr('aria-hidden', 'false')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex', 0)
						.last().focus();
            }
        } else if (e.keyCode == 39) {
            e.preventDefault();
            // This is the last item
            if ($(this).parent('li').next('li').length == 0) {
                $(this).parents('ul').find('> li').first().find('a').first().focus();
            } else {
                $(this).parent('li').next('li').find('a').first().focus();
            }
        } else if (e.keyCode == 40) {
            e.preventDefault();
            if ($(this).parent('li').find('ul').length > 0) {
                $(this).parent('li').find('ul')
					.attr('aria-hidden', 'false')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex', 0)
						.first().focus();
            }
        } else if (e.keyCode == 13 || e.keyCode == 32) {
            // If submenu is hidden, open it
            e.preventDefault();
            $(this).parent('li').find('ul[aria-hidden=true]')
					.attr('aria-hidden', 'false')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex', 0)
						.first().focus();
        } else if (e.keyCode == 27) {
            e.preventDefault();
            $('.' + settings.menuHoverClass)
				.attr('aria-hidden', 'true')
				.removeClass(settings.menuHoverClass)
				.find('a')
					.attr('tabIndex', -1);
        } else {
            $(this).parent('li').find('ul[aria-hidden=false] a').each(function () {
                if ($(this).text().substring(0, 1).toLowerCase() == keyCodeMap[e.keyCode]) {
                    $(this).focus();
                    return false;
                }
            });
        }
    });


    var links = $(top_level_links).parent('li').find('ul').find('a');
    $(links).keydown(function (e) {
        if (e.keyCode == 38) {
            e.preventDefault();
            // This is the first item
            if ($(this).parent('li').prev('li').length == 0) {
                $(this).parents('ul').parents('li').find('a').first().focus();
            } else {
                $(this).parent('li').prev('li').find('a').first().focus();
            }
        } else if (e.keyCode == 40) {
            e.preventDefault();
            if ($(this).parent('li').next('li').length == 0) {
                $(this).parents('ul').parents('li').find('a').first().focus();
            } else {
                $(this).parent('li').next('li').find('a').first().focus();
            }
        } else if (e.keyCode == 27 || e.keyCode == 37) {
            e.preventDefault();
            $(this)
				.parents('ul').first()
					.prev('a').focus()
					.parents('ul').first().find('.' + settings.menuHoverClass)
						.attr('aria-hidden', 'true')
						.removeClass(settings.menuHoverClass)
						.find('a')
							.attr('tabIndex', -1);
        } else if (e.keyCode == 32) {
            e.preventDefault();
            window.location = $(this).attr('href');
        } else {
            var found = false;
            $(this).parent('li').nextAll('li').find('a').each(function () {
                if ($(this).text().substring(0, 1).toLowerCase() == keyCodeMap[e.keyCode]) {
                    $(this).focus();
                    found = true;
                    return false;
                }
            });

            if (!found) {
                $(this).parent('li').prevAll('li').find('a').each(function () {
                    if ($(this).text().substring(0, 1).toLowerCase() == keyCodeMap[e.keyCode]) {
                        $(this).focus();
                        return false;
                    }
                });
            }
        }
    });


    // Hide menu if click or focus occurs outside of navigation
    $(this).find('a').last().keydown(function (e) {
        if (e.keyCode == 9) {
            // If the user tabs out of the navigation hide all menus
            $('.' + settings.menuHoverClass)
				.attr('aria-hidden', 'true')
				.removeClass(settings.menuHoverClass)
				.find('a')
					.attr('tabIndex', -1);
        }
    });
    $(document).click(function () { $('.' + settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('a').attr('tabIndex', -1); });

    $(this).click(function (e) {
        e.stopPropagation();
    });
}
angular.module('rr', ['ngRoute', 'ngDialog', 'ngSanitize', 'ui.select'])
.controller('c',['$scope', '$http', '$location', '$rootScope', '$timeout','$route', '$interval', 'ngDialog', 'timeStamp',
function ($scope, $http, $location, $rootScope, $timeout, $route, $interval, ngDialog, timeStamp) {
    if (typeof $scope.title == 'undefined') {
     keyboard:{
        //var c = -1;
        //var cMin = 0;
        //var cMax = 0;
        $scope.keyP = function (e) {
            //if (e.key === 'Enter') { ngDialog.close(ngDialog.getOpenDialogs()[0]); };
            //if (c >= cMax) {
            //    c = cMin;
            //} else {
            //    c += 1;
            //};
            //$('#' + c).focus();
        };
    }
        // Initial data
        function getSentenceForStars(n) {
            var arr = reviewsRestaurants[n];
            var l = arr.length;
            var rC = 0;
            var stars = 0;
            var finalStars = 0;
            var rCStr = '';
            for (let i = 0; i < l; i++) {
                stars += reviewsRestaurants[n][i].stars;
                ++rC;
            };
            finalStars = stars / rC;
            if (rC == 1) {
                rCStr = rC + ' review'
            } else {
                rCStr = rC + ' reviews'
            };
            return Math.round(finalStars) + ' out of 5 stars, awarded by ' + rCStr;
        };
        $scope.getSentenceForReview = function (s, r, n, t) {
            let sStr = '';
            if (s === 1) { sStr = 'star'; } else { sStr = 'stars' };
            return s + ' ' + sStr + ' the reviewer is ' + n + ' left review is as follows ' + r + 'the review was left on ' + t;
        };
        var reviewsRestaurants = {
            'Coffee Restaurant': [
                { name: 'Lyudmil', review: 'Awful place, serves only coffee', stars: 1, time: '8/27/2016 4:17:41 PM' },
                { name: 'Jojo', review: 'I like coffee, but serving only coffee is too much', stars: 3, time: '8/25/2016 4:17:41 PM' }
            ],
            'Green Restaurant': [{ name: 'Lyudmil', review: 'Perfect place', stars: 5, time: '8/22/2016 4:17:41 PM' }],
            'Marbel Restaurant': [{ name: 'Lyudmil', review: 'Relatively good, italian food fine', stars: 4, time: '8/20/2016 4:17:41 PM' },
                { name: 'Jojo', review: 'Very delicious food', stars: 5, time: '8/17/2016 4:17:41 PM' },
            { name: 'Chocho', review: 'I like it', stars: 4, time: '8/7/2016 4:17:41 PM' }
            ],
            'Pizza Restaurant': [{ name: 'Lyudmil', review: 'Perfect place', stars: 5, time: '8/27/2016 4:17:41 PM' }],
            'Stone Restaurant': [{ name: 'Lyudmil', review: 'Perfect place', stars: 5, time: '8/27/2016 4:17:41 PM' }],
            'Yellow Restaurant': [{ name: 'Lyudmil', review: 'Perfect place', stars: 5, time: '8/27/2016 4:17:41 PM' }]

        };
        var dataRestaurants = [
      { name: 'Coffee Restaurant', type: 'American', id: 1 },
      { name: 'Green Restaurant', type: 'Indian', id: 2 },
      { name: 'Marbel Restaurant', type: 'Italian', id: 3 },
      { name: 'Pizza Restaurant', type: 'French', id: 4 },
      { name: 'Stone Restaurant', type: 'Italian', id: 5 },
      { name: 'Yellow Restaurant', type: 'French', id: 6 }
        ];
        var presentationRestaurants = [
         { name: 'Coffee Restaurant', type: 'American', id: 1, img: 'restaurantreviewer/coffeeRestaurant.jpg', descr: 'Serves coffee and paincake', stars: getSentenceForStars('Coffee Restaurant') },
         { name: 'Green Restaurant', type: 'Indian', id: 2, img: 'restaurantreviewer/greenRestaurant.jpg', descr: 'Serves Indian', stars: getSentenceForStars('Green Restaurant') },
         { name: 'Marbel Restaurant', type: 'Italian', id: 3, img: 'restaurantreviewer/marbelRestaurant.jpg', descr: 'Serves Italian', stars: getSentenceForStars('Marbel Restaurant') },
         { name: 'Pizza Restaurant', type: 'French', id: 4, img: 'restaurantreviewer/pizzaPlace.jpg', descr: 'Serves French', stars: getSentenceForStars('Pizza Restaurant') },
         { name: 'Stone Restaurant', type: 'Italian', id: 5, img: 'restaurantreviewer/stoneRestaurant.jpg', descr: 'Serves burgers', stars: getSentenceForStars('Stone Restaurant') },
         { name: 'Yellow Restaurant', type: 'French', id: 6, img: 'restaurantreviewer/yellowRestaurant.jpg', descr: 'Serves generic', stars: getSentenceForStars('Yellow Restaurant') }
        ];

        $scope.selected = function (c, v) {
            if (c == 'one') {
                for (var i = 0; i < presentationRestaurants.length; i++) {
                    if (v == presentationRestaurants[i].name) {
                        $scope.restaurants.pr = [];
                        $scope.restaurants.pr.push(presentationRestaurants[i]);
                    };
                };
            } else
            {
                $scope.restaurants.pr = [];
                     for (var i = 0; i < presentationRestaurants.length; i++) {
                    if (v == presentationRestaurants[i].type) {
                        $scope.restaurants.pr.push(presentationRestaurants[i]);
                    };
                };
            };
        };
        $scope.title = 'Restaurants';
        $scope.restaurants = {};
        $scope.restaurants.pr = presentationRestaurants;
        $scope.restaurants.all = dataRestaurants;
        $scope.restaurants.reviews = {};
        $scope.addReviewTitle = '';
        $scope.missingReviewVariableSentence = '';
        $scope.initializeAddReviewProcess = function (e) {
            $scope.addReviewTitle = e;
            ngDialog.openConfirm({
                template: 'addReview',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (value) {

            }, function (reason) {
                // Do nothing
            });
        };
        $scope.addReviewProcess = function (o, r, s, n) {
            if (r == undefined) {
                if (s == undefined) {
                    if (n == undefined) {
                        $scope.missingReviewVariableSentence = 'Please enter your review, name and awarded stars';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    } else {
                        $scope.missingReviewVariableSentence = 'Please enter your review and awarded stars';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    };
                } else {
                    if (n == undefined) {
                        $scope.missingReviewVariableSentence = 'Please enter your review and name';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    } else {
                        $scope.missingReviewVariableSentence = 'Please enter your review';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    };
                };
            } else {
                if (s == undefined) {
                    if (n == undefined) {
                        $scope.missingReviewVariableSentence = 'Please enter your name and awarded stars';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    } else {
                        $scope.missingReviewVariableSentence = 'Please select awarded stars';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    };
                } else {
                    if (n == undefined) {
                        $scope.missingReviewVariableSentence = 'Please enter your name';
                        ngDialog.open({
                            template: '<center><a href="" style="font-size:25px;color:black">' + $scope.missingReviewVariableSentence + '</a></center>',
                            plain: true,
                            showClose: false,
                            overlay: false,
                            closeByDocument: true,
                            closeByEscape: true,
                            cache: false,
                            trapFocus: true,
                            preserveFocus: false,
                            resolve: {
                                cl: function cl() {
                                    setTimeout(function () {
                                        ngDialog.close(ngDialog.getOpenDialogs()[1]);
                                    }, 3000);
                                }
                            }
                        });
                    } else {
                        // all is good register
                        var obj = {};
                        obj.name = n;
                        obj.review = r;
                        obj.stars = s;
                        obj.time = timeStamp;
                        (reviewsRestaurants[o]).push(obj);
                        console.log(reviewsRestaurants[o]);
                        ngDialog.close(ngDialog.getOpenDialogs()[0]);
                        for (let i = 0; i < $scope.restaurants.pr.length; i++) {
                            if ($scope.restaurants.pr[i].name === o) {
                                $scope.restaurants.pr[i].stars = getSentenceForStars(o);
                            };
                        };
                        //($scope.restaurants.pr[0]).stars = 'sdsdsd';
                        //console.log($scope.restaurants.pr);
                    };
                };
            };
        };
        $scope.initializeReadReviewProcess = function (e) {
            $scope.readReviewTitle = e;
            $scope.restaurants.reviews = reviewsRestaurants[e];
            console.log($scope.restaurants.reviews);
            ngDialog.openConfirm({
                template: 'readReview',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (value) {

            }, function (reason) {
                // Do nothing
            });
        };

    };
}])
.filter('unique', function () {
    return function (items, filterOn) {
        if (filterOn === false) {
              return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
               var hashCheck = {}, newItems = [];
               var extractValueToCompare = function (item) {
                        if (angular.isObject(item) && angular.isString(filterOn)) {
                              return item[filterOn];
                          } else {
                               return item;
                        }
               };
                   angular.forEach(items, function (item) {
                         var valueToCheck, isDuplicate = false;
                         for (var i = 0; i < newItems.length; i++) {
                               if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                                     isDuplicate = true;
                                     break;
                                   }
                            }
                        if (!isDuplicate) {
                               newItems.push(item);
                            }
                       });
                   items = newItems;
                 }
            return items;
    };
})
.factory('timeStamp', [function () {
        var n = new Date();
        var d = [n.getMonth() + 1, n.getDate(), n.getFullYear()];
        var t = [n.getHours(), n.getMinutes(), n.getSeconds()];
        var s = (t[0] < 12) ? "AM" : "PM";
        t[0] = (t[0] < 12) ? t[0] : t[0] - 12;
        t[0] = t[0] || 12;
        for (let i = 1; i < 3; i++) {
            if (t[i] < 10) {
                t[i] = "0" + t[i];
            }
        };
        return d.join("/") + " " + t.join(":") + " " + s;
}])

