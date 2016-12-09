module.exports = UserService;
var mysql = require('mysql');

function UserService($config, $logger, $event) {
    var self = this;
    var connection = null;
    this.init = function() {
        var dbConfig = $config.get("database");
        //var connectionPool = mysql.createPool(dbConfig);
        connection = mysql.createConnection(dbConfig);
        connection.connect(function(err) {
            if (err) {
                $logger.error("cannot connect to database", err);
                return;
            }
            $logger.debug("connected to database!", err);
        });
    }
    this.login = function(username, password, callbackFn) {
        var retval = false;
        self.findUser({
            username: username,
            password: password.hashHex(),
            status: "active"
        }, function(rows) {
            if (rows != null && rows.length > 0) {
                retval = true;
            }
            callbackFn(retval, rows);
        });
    }
    this.findUser = function(filter, callbackFn) {
        var query = "SELECT * FROM sa_user where 1=1";
        if (filter["username"] != null) {
            query += " AND username = '" + filter["username"] + "'";
        }
        if (filter["apiKey"] != null) {
            query += " AND api_key = '" + filter["apiKey"] + "'";
        }
        if (filter["password"] != null) {
            query += " AND password = '" + filter["password"] + "'";
        }
        if (filter["status"] != null) {
            query += " AND status = '" + filter["status"] + "'";
        }
        if (filter["type"] != null) {
            query += " AND type = '" + filter["type"] + "'";
        }
        connection.query(query, function(err, rows) {
            if (err) {
                $logger.error("Query exception: " + query, err);
                callbackFn(null);
            } else {
                callbackFn(rows);
            }
        });
    }
    /* TODO
    function buildQuery(table, filter, columns) {
        var retval = "";
        var selection = buildQuerySelection(columns);
        var filter = buildQueryFilter(filter);
    };
    function buildQuerySelection(columns) {
        var retval = "*";
        if (columns != null && columns.length > 0) {
        }
        return retval;
    }
    function buildQueryFilter(filter) {
    }
    */
    this.init();
}
