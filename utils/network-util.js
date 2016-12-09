module.exports = {
    getLocalIP: function() {
        var os = require('os');
        var retval = "127.0.0.1";
        var interfaces = os.networkInterfaces();
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    retval = address.address;
                    break;
                }
            }
        }
        return retval;
    }
};
