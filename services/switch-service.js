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
            broadcastMessageToUser(apiKey, "switch.connect", switchObj);
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
                broadcastMessageToUser(apiKey, "switch.connect", switchObj);
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
                    broadcastMessageToUser(apiKey, "switch.remove", switchObj);
                    userSwitches.splice(i, 1);
                    break;
                }
            }
        }
        $logger.debug("switches", switches);
    };
    this.removeAllFromRoom = function(session) {
        var apiKey = session.ctr_apiKey;
        var room = session.ctr_room;
        var userSwitches = switches[apiKey];
        if (userSwitches) {
            for (var i = 0; i < userSwitches.length; i++) {
                console.log("userSwitches[i]", userSwitches[i]);
                if (userSwitches[i].room == room) {
                    broadcastMessageToUser(apiKey, "switch.remove", userSwitches[i]);
                    userSwitches.splice(i, 1);
                }
            }
        }
        $logger.debug("removeAllFromRoom", switches);
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
                    broadcastMessageToUser(apiKey, "switch.update", userSwitches[i]);
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
        var apiKey = io.session.ctr_apiKey;
        var room = io.session.ctr_room;
        var payload = io.inputs;
        payload.type = "dashboard-switch";
        console.log("io.session", io.session);
        sendMessageToRoom(apiKey, room, "message", payload);
    };
    this.setTime = function() {

    };
    function broadcastMessageToUser(apiKey, eventName, data) {
        $socketIOConnection.sendMessageToFilteredSessions(
            {
                ctr_type: "user",
                ctr_apiKey: apiKey
            },
            eventName,
            data
        );
    }
    function sendMessageToRoom(apiKey, room, eventName, data) {
        console.log("sendMessageToRoom", apiKey);
        $socketIOConnection.sendMessageToFilteredSessions(
            {
                ctr_type: "room",
                ctr_apiKey: apiKey,
                ctr_room: "Room 001"
            },
            eventName,
            data
        );
    }
    this.init();
}
