module.exports = SwitchService;

function SwitchService($config, $logger, $event, $socketIOConnection) {
    var self = this;
    var switches = [];
    this.init = function() {
        $event.listen("connection.socketio.*", function(event, session) {
            $logger.debug("on socketio connection event: " + event);
            switch (event) {
                case "connection.socketio.connection":
                    {
                        if (session.ctr_type == "room") {
                            switches[session.ctr_apiKey] = [];
                            session.socket.emit("list-switches", {});
                        } else if(session.ctr_type == "user") {
                            var payloadData = self.find({
                                apiKey: session.ctr_apiKey
                            });
                            if (session.socket != null) {
                                session.socket.emit("switch.list", payloadData);
                            }
                        }
                        break;
                    }
                case "connection.socketio.disconnect":
                    {
                        if (session.ctr_type == "room") {
                            self.removeAllFromRoom(session);
                        }
                        break;
                    }
                default:
                    {

                    }
            }
        });
    };
    this.find = function(filter) {
        var retval = [];
        if(filter.apiKey != null) {
            retval = switches[filter.apiKey];
        }
        return retval;
    };
    this.add = function(io) {
        var apiKey = io.session.ctr_apiKey;
        var switchObj = io.inputs;
        switchObj.apiKey = apiKey;
        switchObj.room = io.session.ctr_room;
        var isExisted = false;
        var userSwitches = switches[apiKey];
        if (userSwitches) {
            for (var i = 0; i < userSwitches.length; i++) {
                if (userSwitches[i].address == switchObj.address) {
                    isExisted = true;
                    break;
                }
            }
        }
        if (isExisted == false) {
            switches[apiKey].push(switchObj);
            io.toEvent("switch.connect").toCriteria("ctr_apiKey", apiKey).json(switchObj);
        }
        $logger.debug("switches", switches);
    };
    this.addAll = function(io) {
        var apiKey = io.session.ctr_apiKey;
        for (var idx = 0; idx < io.inputs.length; idx++) {
            var switchObj = io.inputs[idx];
            switchObj.apiKey = apiKey;
            switchObj.room = io.session.ctr_room;
            var isExisted = false;
            var userSwitches = switches[apiKey];

            if (userSwitches) {
                for (var i = 0; i < userSwitches.length; i++) {
                    if (userSwitches[i].address == switchObj.address) {
                        isExisted = true;
                        break;
                    }
                }
            }
            if (isExisted == false) {
                switches[apiKey].push(switchObj);
                io.toEvent("switch.connect").toCriteria("ctr_apiKey", apiKey).json(switchObj);
            }
        }
        $logger.debug("add all switches", switches);
    };
    this.remove = function(io) {
        var apiKey = io.session.ctr_apiKey;
        var switchObj = io.inputs;
        var userSwitches = switches[apiKey];
        if (userSwitches) {
            for (var i = 0; i < userSwitches.length; i++) {
                if (userSwitches[i].address == switchObj.address) {
                    io.toEvent("switch.remove").toCriteria("ctr_apiKey", apiKey).json(switchObj);
                    userSwitches.splice(i, 1);
                    break;
                }
            }
        }
        $logger.debug("switches", switches);
    };
    this.removeAllFromRoom = function(session) {
        /*
        var apiKey = session.ctr_apiKey;
        var room = session.ctr_room;
        var userSwitches = switches[apiKey];
        if (userSwitches) {
            for (var i = 0; i < userSwitches.length; i++) {
                console.log("userSwitches[i]", userSwitches[i]);
                if (userSwitches[i].room == room) {
                    io.toEvent("switch.remove").toCriteria("ctr_type", "user").json(userSwitches[i]);
                    userSwitches.splice(i, 1);
                }
            }
        }
        $logger.debug("removeAllFromRoom", switches);
        */
    };
    this.update = function(io) {
        var apiKey = io.session.ctr_apiKey;
        var switchObj = io.inputs;
        switchObj.apiKey = apiKey;
        switchObj.room = io.session.ctr_room;
        var isExisted = false;
        var userSwitches = switches[apiKey];
        if (userSwitches) {
            for (var i = 0; i < userSwitches.length; i++) {
                if (userSwitches[i].address == switchObj.address) {
                    isExisted = true;
                    for (var property in switchObj) {
                        userSwitches[i][property] = switchObj[property];
                    }
                    io.toEvent("switch.update").toCriteria("ctr_apiKey", apiKey).json(userSwitches[i]);
                    break;
                }
            }
        }
        if (isExisted == false) {
            // switches[apiKey].push(switchObj);
        }
        $logger.debug("switches",switches);
    };
    this.switch = function(io) {
        console.log("this.switch = function(io) {",io.inputs);
        var payload = io.inputs;
        payload.type = "dashboard-switch";
        io.toEvent("message")
            .toCriteria("ctr_type", "room")
            .toCriteria("ctr_apiKey", io.session.ctr_apiKey)
            .toCriteria("ctr_room", io.session.ctr_room)
            .json(payload);
    };
    this.init();
}
