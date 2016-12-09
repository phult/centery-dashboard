function BaseController($scope, $rootScope, $http, io) {
    var self = this;
    this.initialize = function () {
    };
    $scope.getItem = function (list, fieldName, value) {
        var retVal = null;
        list.forEach(function (item) {
            if (item[fieldName] == value) {
                retVal = item;
            }
        });
        return retVal;
    };
    $scope.removeItem = function (list, fieldName, value) {
        var retval = false;
        for(var i = 0; i < list.length; i++) {
            if(list[i][fieldName] === value) {
                retval = true;
                list.splice(i, 1);
                break;
            }
        }
        return retval;
    };
    $scope.showLoading = function() {

    };
    $scope.hideLoading = function() {

    };
}
