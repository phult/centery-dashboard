module.exports = function ($route, $logger) {
    /** Home Controller **/
    $route.get("/", "HomeController@index");
};
