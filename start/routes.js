module.exports = function ($route, $logger) {
    /** Home Controller **/
    $route.get("/", "HomeController@index");
    $route.get("/", "HomeController@index", {
        before: ["auth"]
    });
    /** User Controller **/
    $route.any("/login", "UserController@login");
    $route.get("/logout", "UserController@logout", {
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
