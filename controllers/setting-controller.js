module.exports = SettingController;

var packageCfg = require(__dir + "/package.json");
var datetimeUtil = require(__dir + "/utils/datetime-util");
var networkUtil = require(__dir + "/utils/network-util");
var util = require(__dir + "/utils/util");

function SettingController($config, $event, $logger) {
    var self = this;
    var localIP = networkUtil.getLocalIP();
    this.index = function(io) {
        var title = $config.get("app.name");
        var configs = [];
        configs.push({
            key: "host",
            name: "Host",
            value: $config.get("app.host")
        });
        configs.push({
            key: "port",
            name: "Port",
            value: $config.get("app.port")
        });
        configs.push({
            key: "apiKey",
            name: "API Key",
            value: io.session.get("user", {}).api_key
        });
        io.render("setting", {
            title: title,
            version: packageCfg.version,
            host: $config.get("app.host", "127.0.0.1"),
            port: $config.get("app.port", "8888"),
            user: io.session.get("user", {}),
            configs: configs
        });
    };
}
