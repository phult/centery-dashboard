module.exports = SwitchController;
var util = require(__dir + "/utils/util");

function SwitchController($config, $event, $logger, $userService, $switchService) {
    var self = this;
    var title = $config.get("app.name");
    var switches = [];
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
        $switchService.switch(io);
    };
}
