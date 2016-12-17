centeryApp.controller('SwitchController', function ($scope, $rootScope, $http, $window, $timeout, io) {
    var self = this;
    $scope.switches = [];
    this.__proto__ = new BaseController($scope, $rootScope, $http, io);
    this.initialize = function () {
        this.__proto__.initialize();
        io.on('switch.list', function (data) {
            $scope.$apply(function () {
                $scope.switches = data;
            });
        });
        io.on('switch.connect', function (data) {
            $scope.$apply(function () {
                if ($scope.switches == null) {
                    $scope.switches = [];
                }
                var existedItem = $scope.getItem($scope.switches, "address", data.address);
                if (existedItem == null) {
                    $scope.switches.push(data);
                }
            });
        });
        io.on('switch.update', function (data) {
            $scope.$apply(function () {
                if ($scope.switches == null) {
                    $scope.switches = [];
                }
                var switchObj = $scope.getItem($scope.switches, "address", data.address);
                for (var property in data) {
                    switchObj[property] = data[property];
                }
            });
        });
        io.on('switch.disconnect', function (data) {
            $scope.$apply(function () {
                if ($scope.switches == null) {
                    $scope.switches = [];
                }
                $scope.removeItem($scope.switches, "address", data.address);
            });
        });
        io.on('switch.remove', function (data) {
            $scope.$apply(function () {
                if ($scope.switches == null) {
                    $scope.switches = [];
                }
                $scope.removeItem($scope.switches, "address", data.address);
            });
        });
    };
    $scope.getSwitchColor = function(switchObj) {
        var retval = "";
        switch (switchObj.state) {
            case '0':
            {
                retval = "bg-green";
                break;
            }
            case '1':
            {
                retval = "bg-red";
                break;
            }
            default:
            {
                retval = "bg-yellow";
            }
        }
        return retval;
    };
    $scope.getSwitchIcon = function(switchObj) {
        var retval = "";
        switch (switchObj.state) {
            case '0':
            {
                retval = "fa-plug";
                break;
            }
            case '1':
            {
                retval = "fa-power-off";
                break;
            }
            default:
            {
                retval = "fa-feed";
            }
        }
        return retval;
    };
    $scope.changeState = function(switchObj) {
        var payload = {
            "hub": switchObj.hubAddress,
            "switch": switchObj.address,
            "state": switchObj.state,
            "room": switchObj.room,
        }
        switch (switchObj.state) {
            case '0':
            {
                payload.state = '1';
                break;
            }
            case '1':
            {
                payload.state = '0';
                break;
            }
            default:
            {
                payload.state = '1';
                //return;
            }
        }
        io.emit("switch.switch", payload);
    };
    this.initialize();
});
