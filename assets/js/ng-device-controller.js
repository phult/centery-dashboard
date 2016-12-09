centeryApp.controller('DeviceController', function ($scope, $rootScope, $http, io) {
    this.__proto__ = new BaseController($scope, $rootScope, $http, io);
    $scope.devices = [];
    $scope.isScanning = false;
    this.initialize = function () {
        this.__proto__.initialize();
        //$scope.scan();
    };
    $scope.scan = function() {
        $scope.isScanning = true;
        $http.get("/device", {}).success(function (data) {
            $scope.isScanning = false;
            if (data.status == "ok") {
                $scope.devices = data.result;
            }
        }).error(function () {
            $scope.isScanning = false;
            alert("An error occurred during processing. Please try again.");
        });
    };
    $scope.connect = function(device) {
        device.isConnecting = true;
        device.isConnectFail = false;
        $http.post("/hub", {
            address: device.address,
            name: device.name
        }).success(function (data) {
            device.isConnecting = false;
            if (data.status == "ok") {
                $scope.removeItem($scope.devices, "address", device.address);
            } else {
                device.isConnectFail = true;
            }
        }).error(function () {
            device.isConnecting = false;
            device.isConnectFail = true;
        });
    };
    this.initialize();
});
