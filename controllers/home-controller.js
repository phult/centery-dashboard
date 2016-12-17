module.exports = HomeController;

var fs = require("fs");
var packageCfg = require(__dir + "/package.json");
var networkUtil = require(__dir + "/utils/network-util");

function HomeController($config, $event, $logger, $userService) {
    var self = this;
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
}
