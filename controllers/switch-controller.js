module.exports = SwitchController;
var util = require(__dir + "/utils/util");
var fs = require("fs");
var packageCfg = require(__dir + "/package.json");
var networkUtil = require(__dir + "/utils/network-util");
function SwitchController($config, $event, $logger, $userService, $switchService) {
    var self = this;
    var title = $config.get("app.name");
    var switches = [];
    this.index = function(io) {
        var title = $config.get("app.name");
        io.render("home", {
            title: title,
            version: packageCfg.version,
            host: $config.get("app.host", "127.0.0.1"),
            port: $config.get("app.port", "8888"),
            user: io.session.get("user", {})
        });
    };
    this.room = function(io) {
        var title = $config.get("app.name");
        io.render("room", {
            title: title,
            version: packageCfg.version,
            host: $config.get("app.host", "127.0.0.1"),
            port: $config.get("app.port", "8888"),
            user: io.session.get("user", {})
        });
    };
    this.listRooms = function(io) {
        var rooms = $switchService.findRooms({
            apiKey: io.inputs.apiKey
        });
        io.toEvent("switch.list-rooms").json(rooms);
    };
    this.onList = function(io) {
        $switchService.addAll(io);
    };
    this.onConnect = function(io) {
        $switchService.add(io);
    };
    this.onDisconnect = function(io) {
        $switchService.remove(io);
    };
    this.onRemove = function(io) {
        $switchService.remove(io);
    };
    this.onUpdate = function(io) {
        $switchService.update(io);
    };
    this.switch = function(io) {
        $switchService.switch(io.session.ctr_apiKey, io.inputs);
    };
    this.setTimer = function(io) {
        $switchService.setTimer(io);
    }
    this.restartRoom = function(io) {
        $switchService.restartRoom(io.session.get("user", {}).api_key, io.inputs.room);
    }
}
