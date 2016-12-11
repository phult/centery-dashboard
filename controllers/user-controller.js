module.exports = UserController;
var util = require(__dir + "/utils/util");

function UserController($config, $event, $logger, $userService) {
    var self = this;
    var title = $config.get("app.name");
    this.login = function(io) {
        if (io.method == "get") {
            var user = io.session.get("user", null);
            // check if user's logged in
            if (user != null) {
                io.redirect("/");
            } else {
                io.render("login", {
                    title: title
                });
            }
        } else if (io.method == "post") {
            login(io, io.inputs["username"], io.inputs["password"], function(result) {
                if (result) {
                    io.redirect("/");
                } else {
                    io.render("login", {
                        title: title,
                        result: false
                    });
                }
            })
        }
    };
    this.logout = function(io) {
        destroyUserSession(io);
        io.redirect("/login");
    };
    function login(io, username, password, callbackFn) {
        $userService.login(username, password, function(result, user) {
            if (result) {
                setUserSession(io, user);
            }
            callbackFn(result);
        });
    }
    function setUserSession(io, user) {
        io.session.set("user", user);
    }
    function destroyUserSession(io) {
        io.session.remove("user");
    }
}
