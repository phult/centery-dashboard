module.exports = function ($route, $logger) {
    /** Home Controller **/
    $route.get("/", "HomeController@index", {
        before: ["auth"]
    });
    /** User Controller **/
    $route.any("/login", "UserController@login");
    $route.get("/logout", "UserController@logout", {
        before: ["auth"]
    });
    /** Switch Controller **/
    $route.io("switch.list", "SwitchController@onList");
    $route.io("switch.connect", "SwitchController@onConnect");
    $route.io("switch.remove", "SwitchController@onRemove");
    $route.io("switch.update", "SwitchController@onUpdate");
    $route.io("switch.disconnect", "SwitchController@onDisconnect");
    $route.io("switch.switch", "SwitchController@switch");
    /** Setting Controller **/
    $route.get("/setting", "SettingController@index", {
        before: ["auth"]
    });
    /** Filters **/
    $route.filter("auth", function (io) {
        if (io.session.get("user") == null) {
            io.redirect("/login");
            return false;
        }
    });
};
