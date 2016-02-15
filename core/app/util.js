/**
 * @author Phuluong
 * May 13, 2015 5:02:26 PM
 */

/** Exports **/
module.exports = new Util();
/** Imports **/
var fs = require("fs");
/** Modules **/
/**
 * Hash a string
 * @returns {Number}
 */
String.prototype.hash = function () {
    var retval = 0, i, chr, len;
    if (this.length === 0)
        return retval;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        retval = ((retval << 5) - retval) + chr;
        retval |= 0; // Convert to 32bit integer
    }
    return retval;
};
/**
 * Replace all search string in a string
 * @param {String} search
 * @param {String} replacement
 * @returns {String}
 */
String.prototype.replaceAll = function (search, replacement) {
    return this.split(search).join(replacement);
};
/**
 * Check string is matched a wildcard
 * @param {String} wildcard
 * @returns {Boolean}
 */
String.prototype.matchWildcard = function (wildcard) {
    wildcard = wildcard.replace(/[\-\[\]\/\{\}\(\)\+\.\\\^\$\|]/g, "\\$&");
    wildcard = wildcard.replace(/\*/g, ".*");
    wildcard = wildcard.replace(/\?/g, ".");
    var regEx = new RegExp(wildcard, "i");
    return regEx.test(this);
};
function Util() {
    this.now = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : "0" + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : "0" + day;
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    };
    this.getFunctionParamNames = function (func) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null) {
            result = [];
        }
        return result;
    };
    this.parseObjectToRequestURL = function (obj) {
        var retval = "";
        var index = 0;
        for (var property in obj) {
            retval += (index == 0 ? "" : "&") + property + "=" + obj[property];
            index++;
        }
        return retval;
    };
    /**
     * Return a random string with length
     * @param {Int} length
     * @returns {String}
     */
    this.randomString = function (length) {
        var retval = "";
        if (length == null) {
            length = 8;
        }
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            retval += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return retval;
    };
    /**
     * Delete directory and files
     * @param {String} path     
     */
    this.deleteDirectory = function (path) {
        var self = this;
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    self.deleteDirectory(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    /**
     * Get array with unique items
     * @returns {Array}
     */
    this.arrayUnique = function (arr) {
        var retval = arr.concat();
        for (var i = 0; i < retval.length; ++i) {
            for (var j = i + 1; j < retval.length; ++j) {
                if (retval[i] === retval[j])
                    retval.splice(j--, 1);
            }
        }
        return retval;
    };
    /**
     * Remove item array from source array
     * @param {Array} removedItems
     * @returns {Array}
     */
    this.arrayRemoveItems = function (arr, removedItems) {
        var retval = arr;
        for (var i = 0; i < removedItems.length; ++i) {
            for (var j = 0; j < retval.length; ++j) {
                if (removedItems[i] === retval[j]) {
                    retval.splice(j, 1);
                }
            }
        }
        return retval;
    };
    /**
     * Get file list with full-path in a directory
     * @param {String} directory
     * @returns {Array}
     */
    this.browseFiles = function (directory) {
        var retval = [];
        var self = this;
        if (fs.existsSync(directory)) {
            fs.readdirSync(directory).forEach(function (item) {
                var subPath = directory + "/" + item;
                if (fs.lstatSync(subPath).isDirectory()) {
                    var files = self.browseFiles(subPath);
                    if (files.length > 0) {
                        retval = retval.concat(files);
                    }
                } else {
                    retval.push(subPath);
                }
            });
        }
        return retval;
    };
}