var config = require(__dir + "/core/app/config");
var routerLoader = require(__dir + "/core/loader/route-loader");
var event = require(__dir + "/core/app/event");
var logger = (require(__dir + "/core/log/logger-factory")).getLogger();
var socketIOConnection = require(__dir + "/core/net/socket-io-connection");
var UserService = (require(__dir + "/services/user-service"));
var SwitchService = (require(__dir + "/services/switch-service"));
var userService = new UserService(config, logger, event);
var switchService = new SwitchService(config, logger, event, socketIOConnection);
module.exports = function ($serviceContainer) {
    $serviceContainer.bind("$config", config);
    $serviceContainer.bind("$route", routerLoader);
    $serviceContainer.bind("$event", event);
    $serviceContainer.bind("$logger", logger);
    $serviceContainer.bind("$userService", userService);
    $serviceContainer.bind("$switchService", switchService);
    $serviceContainer.bind("$socketIOConnection", socketIOConnection);
};
