module.exports = function ($route, $logger) {
    /** Home Controller **/
    /** User Controller **/
    $route.any("/login", "UserController@login");
    $route.get("/logout", "UserController@logout", {
        before: ["auth"]
    });
    /** Switch Controller **/
    $route.get("/", "SwitchController@index", {
        before: ["auth"]
    });
    $route.get("/room", "SwitchController@room", {
        before: ["auth"]
    });
    $route.io("switch.list-rooms", "SwitchController@listRooms");
    $route.io("switch.restart-room", "SwitchController@restartRoom");
    $route.io("switch.list", "SwitchController@onList");
    $route.io("switch.connect", "SwitchController@onConnect");
    $route.io("switch.remove", "SwitchController@onRemove");
    $route.io("switch.update", "SwitchController@onUpdate");
    $route.io("switch.disconnect", "SwitchController@onDisconnect");
    $route.io("switch.switch", "SwitchController@switch");
    $route.io("switch.set-timer", "SwitchController@setTimer");
    $route.io("hub.update", "SwitchController@onUpdateHub");
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
