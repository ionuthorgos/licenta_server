
var LZString = require("lz-string");
// var logger = require("../shared/logger/loggerService");
const moment = require('moment');
module.exports = function() {
    var data = {
        zip: {
            compress: function(str, pass) {
                //var compressed = LZString.compress(str);
                var compressed = LZString.compressToUTF16(str);
                return compressed;
            },
            decompress: function(compressed, pass) {
                try {
                    //var rez = LZString.decompress(compressed);
                    var rez = LZString.decompressFromUTF16(compressed);
                    return rez;
                } catch (e) {
                    logger.log("decompress error " + e);
                    return null;
                }
            },
            compressObj: function(obj, pass) {
                if (!obj)
                    return "";

                //var compressed = LZString.compress(str);
                var compressed = LZString.compressToUTF16(JSON.stringify(obj));
                return compressed;
            },
            decompressToObj: function(compressed, pass) {
                //var rez = LZString.decompress(compressed);
                var rez = LZString.decompressFromUTF16(compressed);
                return JSON.parse(rez);
            }
        },
        funcFromString: function(inputParamName, bodyFunction) {
            //http://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
            var fctResult = null;
            try{
                fctResult = Function(inputParamName, bodyFunction);
                return fctResult;
            }
            catch(e)
            {
                logger.log("EXceptin on funcFromString "+e);
                return null;
            }
        },
        combineCharacters: function() {
            //idea is that if i provide 3 guids it will return all characters ordered alphabetically
            function mySort(a, b) {
                var ret = 0;
                if (a > b)
                    ret = 1;
                if (a < b)
                    ret = -1;
                return ret;
            }

            var source = "";
            for (var i = 0; i < arguments.length; i++) {
                source += arguments[i];
            }
            return (source.split('').sort(mySort).join(''))
        },
        coordFromAddress: function(address, callback) {
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({
                    'address': address
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        callback(results[0]);
                    }
                });
            }
        },
        geoDistance: function(p1, p2) {
            function distance(lon1, lat1, lon2, lat2) {
                var R = 6371; // Radius of the earth in km
                var dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
                var dLon = (lon2 - lon1).toRad();
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                return d;
            }
            var result = distance(p1[1], p1[0], p2[1], p2[0]);
            return result;
        },
        hasValue: function(obj) {
            if (obj == undefined || obj == null || obj === "")
                return false;
            return true;
        },
        parseObjectByPropertyNames: function(obj, properties) {
            if (!obj)
                return;
            var props = properties.split(".");
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                obj = obj[prop];
                if (!obj) {
                    break;
                }
            }
            return obj;
        },
        format: function(val, arr) {
            var inVal = val;

            if (!arr)
                return val;

            for (var i = 0; i < arr.length; i++) {
                var regEx = new RegExp("\\{" + i + "\\}", "gm");
                inVal = inVal.replace(regEx, arr[i]);
            }

            return inVal;
        },
        getObjectType: function(val) {
            if ((typeof val === 'number') && (val % 1 === 0)) {
                return "int"
            }
            if (typeof val === "string") {
                return "string";
            }
            if (val instanceof Array) {
                return "array";
            }
            if ((new Date(val) !== "Invalid Date" && !isNaN(new Date(val)))) {
                return "date";
            }
            return "obj";
        },
        getObjProp: function(obj) {
            var rez = [];
            for (var key in obj) {
                rez.push(key);
            }
            return rez;
        },
        getObjPropAndType: function(obj) {
            var rez = [];
            for (var key in obj) {
                var val = obj[key];
                rez.push({
                    "p": key,
                    "t": this.getObjectType(val)
                });
            }
            return rez;
        },
        compare: function(obj1, obj2) {
            var result = null;

            function addResult(result, path, oldv, newv) {
                if (result == null) {
                    result = [];
                }
                result.push({
                    path: path,
                    oldv: oldv,
                    newv: newv
                });
                return result;
            };

            function check(inst, obj1, obj2, path) {
                var result = [];
                if (!obj1) {
                    result = addResult(result, path, null, obj2);
                    return result;
                }
                if (!obj2) {
                    result = addResult(result, path, null, obj1);
                    return result;
                }

                var obj1p = inst.getObjPropAndType(obj1);
                //var obj2p = getObjPropAndType(obj2);
                for (var i = 0; i < obj1p.length; i++) {
                    var pt = obj1p[i];

                    var newPath = "";
                    if (path == "") {
                        newPath = pt.p;
                    } else {
                        newPath = path + "." + pt.p;
                    }


                    switch (pt.t) {
                        case "array":
                            {
                                for (var i = 0; i < obj1[p].length; i++) {
                                    var r = check(inst, obj1[pt.p], obj2[pt.p], newPath);
                                    if (r != null) {
                                        for (var k = 0; k < r.length; r++) {
                                            result.push(r[k]);
                                        }
                                    }
                                }
                                break;
                            }
                        case "obj":
                            {
                                var r = check(inst, obj1[pt.p], obj2[pt.p], newPath);
                                if (r != null) {
                                    for (var k = 0; k < r.length; r++) {
                                        result.push(r[k]);
                                    }
                                }
                                break;
                            }
                        default:
                            {
                                if (obj2[pt.p] == undefined) {
                                    result = addResult(result, newPath, obj1[pt.p], null);
                                } else {
                                    if (obj1[pt.p] != obj2[pt.p]) {
                                        result = addResult(result, newPath, obj1[pt.p], obj2[pt.p]);
                                    }
                                }
                                break;
                            }
                    }
                }

                return result;
            }

            result = check(this, obj1, obj2, "");

            return result;
        },
        isUrl: function(val) {
            //var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?/;
            if (!regex.test(val)) {
                return false;
            } else {
                return true;
            }
        },
        isPromise: function(prom) {
            if (!prom)
                return false;
            if (prom.then && (typeof(prom.then) == typeof(Function))) {
                return true;
            }
            return false;
        },
        isImageUrl: function(url) {
            return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
        },
        isNumber: function(val) {
            if ((typeof val === 'number') && (val % 1 === 0)) {
                return true;
            }
            return false;
        },
        isBool: function(val) {
            if (typeof(val) === "boolean") {
                return true;
            }
            return false;
        },
        isArray: function(val) {
            if (val && (val instanceof Array)) {
                return true;
            }
            return false;
        },
        getArgs: function(func) {
            // First match everything inside the function argument parens.
            var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

            // Split the arguments string into an array comma delimited.
            return args.split(',').map(function(arg) {
                // Ensure no inline comments are parsed and trim the whitespace.
                return arg.replace(/\/\*.*\*\//, '').trim();
            }).filter(function(arg) {
                // Ensure no undefined values are added.
                return arg;
            });
        },
        callFunction: function(func, args) {
            //var args = Array.prototype.slice.call(arguments).splice(1);
            var rez = null;
            rez = func.apply(this, args);
            // if(args)
            // {

            // } else{}
            return rez;
        },
        deleteItemFromArray: function(arr, index) {
            arr.splice(index, 1);
        },
        serialize: function(obj) {
            return null;
        },
        listWrapper: function() {
            var rez = {
                items: [],
                add: function(it) {
                    if (it == undefined || it == null) {
                        return;
                    }
                    this.items.push(it);
                },
                addNull: function() {
                    this.items.push(null);
                },
                removeAtIndex: function(index, it) {
                    it = null;
                    this.items.splice(index, 1);
                },
                remove: function(it) {
                    it = null;
                    this.items.splice(index, 1);
                },
                replace: function(index, it) {
                    it = null;
                    this.items.splice(index, 1);
                },
                get: function() {
                    return this.items;
                },
                set: function(value) {
                    this.items = value;
                },
                firstOrDefault: function(predicate) {
                    var rez = _.find(this.items, predicate);
                    return rez;
                }

            };
            return rez;
        },
        randCharacters: function(max) {
            if (!max) {
                max = 5;
            }
            Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, max);
        },
        rand4: function() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
            return _p8();
        },
        uuid: function() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },
        uuidSmall: function() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "" + p.substr(0, 4) +  p.substr(4, 4) : p;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },
        clone: function(obj) {
            if (obj == undefined) {
                return obj;
            }
            var str = JSON.stringify(obj);
            return JSON.parse(str);
        },
        toInt: function(val) {
            if (val && typeof(val) == 'string') {
                return parseInt(val);
            }
            return val;
        },
        date:{
            //https://stackoverflow.com/questions/26873200/momentjs-getting-javascript-date-in-utc
            dateAsUtc:function(input)
            {
                var utcMoment = null;
                if(input)
                {
                    utcMoment = moment.utc(input);
                }else{
                    utcMoment = moment.utc();
                }
                var utcDate = new Date( utcMoment.format() );
                return utcDate;
            },
            dateAsUtcLong:function(input)
            {
                if(input)
                {
                    return moment.utc( input ).valueOf();
                }
                return moment.utc().valueOf();
            },
            dateAsUtcDateAndLong:function(input)
            {
                var utcMoment = null;
                if(input)
                {
                    utcMoment = moment.utc(input);
                }else{
                    utcMoment = moment.utc();
                }
                return {
                    date:new Date( utcMoment.format() ),
                    dateLong:utcMoment.valueOf()
                }
            },
            longToDate:function (uNIX_Timestamp) {
                var dateTime = new Date(uNIX_Timestamp);
                return dateTime.toISOString(); // Returns "2013-05-31T11:54:44.000Z"
            },
          dateToUtcMilliSecconds: function(date)
          {
            return Date.UTC(date.val.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
              date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
          },
          localDateToUtcMilliSecconds: function(date)
          {
            return  date.getTime() + (date.getTimezoneOffset() * 60000);
          },

          utcMilliSeccondsToLocalDate: function(millisecconds)
          {
            var now = new Date();
            return now.setTime(millisecconds - (now.getTimezoneOffset() * 60000));
          },
          utcMilliSeccondsToTimeZoneDate:function(millisecconds, timezoneOffset )
          {
            var now = new Date();
            return now.setTime(millisecconds - (timezoneOffset * 60000));
          }

        },
        toUtc: function(val) {
            if (val && typeof(val) == 'string') {
                return moment(dateString).toUTCString();
            }
            return val.toUTCString();
        },
        fromUtc: function(val, format) {
            if (!val) {
                return null;
            }
            if (format) {
                //YYYY-MM-DD HH:mm:ss
                return moment(val).format(format).toDate();
            }
            return moment(val).toDate();
        },
        toDateTimeInfo: function(val) {
            var result = {
                Year: val.getFullYear(),
                Month: val.getMonth(),
                Day: val.getDate(),
                Hour: val.getHours(),
                Minute: val.getMinutes(),
                Seccond: val.getSeconds(),
                Offset: val.getTimezoneOffset(),
                date: val,
                utc:Date.UTC(val)
            };

            return result;
        },
        toDateTimeInfoMom: function(val) {
            var result = {
                Year: val.year(),
                Month: val.month(),
                Day: val.day(),
                Hour: val.hour(),
                Minute: val.minutes(),
                Seccond: val.seconds(),
                Offset: new Date().getTimezoneOffset()
            };

            return result;
        },

        forEach: function(arr, method) {
            if (!arr)
                return;
            for (var i = 0; i < array.length; i++) {
                method(array[i]);
            }
        },
        getUrlParams: function(url) {
            if (typeof url == 'undefined') {
                url = window.location.search
            }
            var urlParams = {}
            var queryString = url.split('?')[1]
            if (queryString) {
                var keyValuePairs = queryString.split('&')
                for (var i = 0; i < keyValuePairs.length; i++) {
                    var keyValuePair = keyValuePairs[i].split('=')
                    var paramName = keyValuePair[0]
                    var paramValue = keyValuePair[1] || ''
                    urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '))
                }
            }
            return urlParams;
        },
        pager: function() {

            var pagerInfo = {
                pageSizes: [5, 10, 25, 30],
                pageSize: 10,
                currentPage: 1,
                totalServerItems: 0,
                FirstPage: function() {
                    this.currentPage = 0;
                },
                NextPage: function() {
                    this.currentPage++;
                },
                PreviousPage: function() {
                    this.currentPage--;
                },
                LastPage: function() {
                    this.currentPage = 0;
                },
                SetTotalItems: function(val) {
                    this.totalServerItems = val;
                },
                SortCriteria: function(propName, ascending) {
                    this.PropertyName = propName;
                    this.Ascending = ascending;
                },
                FilterCriteria: function() {
                    this.FieldName = "";
                    this.Operator = 0;
                    this.Value;
                }
            };

            return pagerInfo;
        }
    };
    return data;

}
