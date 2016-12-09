module.exports = {
    flatArrayToObject: function (array) {
        var retval = [];
        for (var i = 0; i < array.length; i = i + 2) {
            retval.push({key: array[i], value: array[i + 1]});
        }
        return retval;
    }
};