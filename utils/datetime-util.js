module.exports = new DateTimeUtils();
function DateTimeUtils() {
    /**
     * Get timestamp of today (at 00:00:00.00)
     * @param {Date} dateTime
     * @returns {long}
     */
    this.dayTimestamp = function (dateTime) {
        dateTime.setHours(0);
        dateTime.setMinutes(0);
        dateTime.setSeconds(0);
        dateTime.setMilliseconds(0);
        return dateTime.getTime();
    };

    this.milisecondToString = function(time){
        var date = new Date(parseInt(time));
        return date.getDate() + "/"
            + (date.getMonth()+1)  + "/"
            + date.getFullYear();
    };
}