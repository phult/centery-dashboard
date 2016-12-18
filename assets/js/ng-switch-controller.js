centeryApp.controller('SwitchController', function ($scope, $rootScope, $http, $window, $timeout, io) {
    var self = this;
    $scope.switches = [];
    $scope.timer = {};
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
            hubAddress: switchObj.hubAddress,
            address: switchObj.address,
            state: switchObj.state,
            room: switchObj.room,
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
    $scope.setTimerOn = function(switchObj) {
        $scope.timer = switchObj;
        $scope.timer.timerType = "on";
        $scope.timer.timerTime = $scope.getCurrentTimeString(10);
        $scope.timer.timerDate = $scope.getCurrentDateString();
    };
    $scope.setTimerOff = function(switchObj) {
        $scope.timer = switchObj;
        $scope.timer.timerType = "off";
        $scope.timer.timerTime = $scope.getCurrentTimeString(10);
        $scope.timer.timerDate = $scope.getCurrentDateString();
    };
    $scope.saveTimer = function() {
        if ($scope.timer.timerType == "on"){
            $scope.timer.timerOn = $scope.timer.timerTime + " " + $scope.timer.timerDate;
        } else if ($scope.timer.timerType == "off"){
            $scope.timer.timerOff = $scope.timer.timerTime + " " + $scope.timer.timerDate;
        }
        io.emit("switch.set-timer", $scope.timer);
    };
    $scope.clearTimer = function() {
        if ($scope.timer.timerType == "on"){
            $scope.timer.timerOn = null;
        } else if ($scope.timer.timerType == "off"){
            $scope.timer.timerOff = null;
        }
        io.emit("switch.set-timer", $scope.timer);
    };
    $scope.cancelTimer = function() {

    };
    this.initialize();
});
