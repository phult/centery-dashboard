centeryApp.controller('RoomController', function ($scope, $rootScope, $http, io) {
    var self = this;
    $scope.rooms = [];
    $scope.apiKey = apiKey;
    this.__proto__ = new BaseController($scope, $rootScope, $http, io);
    this.initialize = function () {
        this.__proto__.initialize();
        io.on('switch.removeRoom', function (data) {
            $scope.$apply(function () {
                delete $scope.rooms[data];
            });
        });
        io.on('switch.list-rooms', function (data) {
            $scope.$apply(function () {
                $scope.rooms = data;
            });
        });
        io.on('switch.list', function (data) {
            self.reload();
        });
        io.on('switch.connect', function (data) {
            self.reload();
        });
        io.on('switch.update', function (data) {
            self.reload();
        });
        io.on('switch.disconnect', function (data) {
            self.reload();
        });
        io.on('switch.remove', function (data) {
            self.reload();
        });
    };
    this.reload = function() {
        io.emit("switch.list-rooms", {apiKey: $scope.apiKey});
    };
    $scope.restart = function(room) {
        io.emit("switch.restart-room", {room: room});
    };
    this.initialize();
});
