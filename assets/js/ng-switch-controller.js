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
                var existedItem = $scope.getItem($scope.switches, "address", data.address);
                if (existedItem == null) {
                    $scope.switches.push(data);
                }
            });
        });
        io.on('switch.update', function (data) {
            $scope.$apply(function () {
                var switchObj = $scope.getItem($scope.switches, "address", data.address);
                for (var property in data) {
                    switchObj[property] = data[property];
                }
            });
        });
        io.on('switch.disconnect', function (data) {
            $scope.$apply(function () {
                $scope.removeItem($scope.switches, "address", data.address);
            });
        });
        io.on('switch.remove', function (data) {
            $scope.$apply(function () {
                $scope.removeItem($scope.switches, "address", data.address);
            });
        });
    };
    $scope.remove = function(switchObj) {
        $http.post("/remove-switch", {
            'switch': switchObj.address
        }).success(function (data) {

        }).error(function () {
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
        $http.post("/switch", payload).success(function (data) {
            if (data.status == "ok") {
            } else {
            }
        }).error(function () {
        });
    };
    $scope.rename = function(switchObj) {
        $scope.onRenaming = true;
        switchObj.currentName = switchObj.name;
        $scope.selectedSwitch = switchObj;
        $timeout(function() {
            $window.document.getElementById("switch-name").focus();
        }, 500);
    };
    $scope.cancelRename = function() {
        $scope.onRenaming = false;
        $scope.selectedSwitch.name = $scope.selectedSwitch.currentName;
    };
    $scope.saveName = function() {
        $scope.onRenaming = false;
        $scope.selectedSwitch.name = $scope.selectedSwitch.currentName;
        $http.post("/rename-switch", {
            'hub': $scope.selectedSwitch.hubAddress,
            'switch': $scope.selectedSwitch.address,
            'name': $scope.selectedSwitch.name
        }).success(function (data) {

        }).error(function () {
        });
    };
    this.initialize();
});
