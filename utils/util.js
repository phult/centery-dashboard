module.exports = {
    flatArrayToObject: function (array) {
        var retval = [];
        for (var i = 0; i < array.length; i = i + 2) {
            retval.push({key: array[i], value: array[i + 1]});
        }
        return retval;
    },
    findItems: function (list, filter) {
        var retVal = [];
        list.forEach(function (item) {
            var isValid = true;
            for (var variable in filter) {
                if (!item.hasOwnProperty(variable) || (item.hasOwnProperty(variable) && item[variable] != filter[variable])) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                retVal.push(item);
            }
        });
        return retVal;
    }
};
