var centeryApp = angular.module('centeryApp', []);

centeryApp.factory('io', function ($rootScope) {
    var socket = io("http://" + host + ":" + port, {
        query:
            "extra=ctr_type,ctr_apiKey" +
            "&ctr_type=user" +
            "&ctr_apiKey=" + apiKey
    });
    return socket;
});
centeryApp.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                console.log('value=', value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function () {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
}]);
