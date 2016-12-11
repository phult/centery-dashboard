module.exports = SwitchController;
var util = require(__dir + "/utils/util");

function SwitchController($config, $event, $logger, $userService) {
    var self = this;
    var title = $config.get("app.name");
    this.connect = function(io) {
        console.log("connect", io.inputs);
    }
    this.disconnect = function(io) {
        console.log("disconnect", io.inputs);
    }
    this.remove = function(io) {
        console.log("remove", io.inputs);
    }
    this.update = function(io) {
        console.log("update", io.inputs);
    }
}
