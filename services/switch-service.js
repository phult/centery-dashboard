module.exports = SwitchService;
var fecha = require("fecha");
var util = require(__dir + "/utils/util");

function SwitchService($config, $logger, $event, $socketIOConnection) {
    var self = this;
    var switches = [];
    var timers = [];
    this.init = function() {
        setInterval(executeTimers, 10000);
        $event.listen("connection.socketio.*", function(event, session) {
            $logger.debug("on socketio connection event: " + event);
            switch (event) {
                case "connection.socketio.connection":
                    {
                        if (session.ctr_type == "room") {
                            if (switches.indexOf(session.ctr_apiKey) == -1) {
                                switches[session.ctr_apiKey] = [];
                            }
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
                            self.removeRoom(session);
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
            addTimerInfoToNewSwitch(switchObj);
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
                addTimerInfoToNewSwitch(switchObj);
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
    this.removeRoom = function(session) {
        var apiKey = session.ctr_apiKey;
        var room = session.ctr_room;
        var userSwitches = switches[apiKey];
        if (userSwitches) {
            for (var i = 0; i < userSwitches.length; i++) {
                if (userSwitches[i].room == room) {
                    broadcastMessageToUser(apiKey, "switch.remove", userSwitches[i]);
                    userSwitches.splice(i, 1);
                }
            }
        }
        broadcastMessageToUser(apiKey, "switch.removeRoom", room);
        $logger.debug("removeRoom", switches);
    };
    this.update = function(io) {
        var apiKey = io.session.ctr_apiKey;
        var switchObj = io.inputs;
        switchObj.apiKey = apiKey;
        switchObj.room = io.session.ctr_room;
        updateSwitchData(apiKey, switchObj);
    };
    /**
    * Change switch state
    * @param apiKey
    * @param switchObj {room, hubAddress, address, state}
    **/
    this.switch = function(apiKey, switchObj) {
        var payload = switchObj;
        payload.type = "dashboard-switch";
        sendMessageToRoom(apiKey, payload.room, "message", payload);
    };
    this.setTimer = function(io) {
        var timer = {
            apiKey: io.inputs.apiKey,
            room: io.inputs.room,
            address: io.inputs.address,
            hubAddress: io.inputs.hubAddress,
            timerOn: io.inputs.timerOn,
            timerOff: io.inputs.timerOff
        };
        updateSwitchData(timer.apiKey, timer);
        var existedTimer = false;
        for (var i = 0; i < timers.length; i++) {
            if (timers[i].apiKey == timer.apiKey &&
                timers[i].room == timer.room &&
                timers[i].address == timer.address) {
                timers[i].timerOn = timer.timerOn;
                timers[i].timerOff = timer.timerOff;
                existedTimer = true;
                break;
            }
        }
        if (existedTimer == false) {
            timers.push(timer);
        }
        $logger.debug("setTimer", timer);
    };
    this.findRooms = function(filter) {
        var retval = {};
        if (filter.apiKey != null) {
            var apiSwitches = self.find({
                apiKey: filter.apiKey
            });
            for (var i = 0; i < apiSwitches.length; i++) {
                if (retval[apiSwitches[i].room] == null) {
                    retval[apiSwitches[i].room] = 1;
                } else {
                    retval[apiSwitches[i].room]++;
                }
            }
        }
        return retval;
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
        $socketIOConnection.sendMessageToFilteredSessions(
            {
                ctr_type: "room",
                ctr_apiKey: apiKey,
                ctr_room: room
            },
            eventName,
            data
        );
    }
    function updateSwitchData(apiKey, switchObj) {
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
    }
    function executeTimers() {
        for (var i = 0; i < timers.length; i++) {
            var timer = timers[i];
            if (timer.timerOn != null && (new Date() > fecha.parse(timer.timerOn, 'HH:mm DD/MM/YYYY'))) {
                $logger.debug("executeTimers", timer);
                self.switch(timer.apiKey, {
                    room: timer.room,
                    hubAddress: timer.hubAddress,
                    address: timer.address,
                    state: '1'
                });
                // send switch state to users
                timer.timerOn = null;
                updateSwitchData(timer.apiKey, timer);
                // clear the timer
                var existedTimers = util.findItems(timers, {
                    apiKey: timer.apiKey,
                    room: timer.room,
                    address: timer.address,
                    hubAddress: timer.hubAddress
                });
                for (var i = 0; i < existedTimers.length; i++) {
                    existedTimers[i].timerOn = null;
                }
            }
            if (timer.timerOff != null && (new Date() > fecha.parse(timer.timerOff, 'HH:mm DD/MM/YYYY'))) {
                $logger.debug("executeTimers", timer);
                self.switch(timer.apiKey, {
                    room: timer.room,
                    hubAddress: timer.hubAddress,
                    address: timer.address,
                    state: '0'
                });
                // send switch state to users
                timer.timerOff = null;
                updateSwitchData(timer.apiKey, timer);
                // clear the timer
                var existedTimers = util.findItems(timers, {
                    apiKey: timer.apiKey,
                    room: timer.room,
                    address: timer.address,
                    hubAddress: timer.hubAddress
                });
                for (var i = 0; i < existedTimers.length; i++) {
                    existedTimers[i].timerOff = null;
                }
            }
        }
    }
    function addTimerInfoToNewSwitch(switchObj) {

        var existedTimers = util.findItems(timers, {
            apiKey: switchObj.apiKey,
            room: switchObj.room,
            address: switchObj.address,
            hubAddress: switchObj.hubAddress
        });
        if (existedTimers.length > 0) {
            switchObj.timerOn = existedTimers[0].timerOn;
            switchObj.timerOff = existedTimers[0].timerOff;
        }
    }
    this.init();
}
