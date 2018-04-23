//http://stackoverflow.com/questions/25353444/outputting-human-readable-times-from-timestamps-on-blockchain-info
const moment = require('moment');

class Utils {
    dateToLong(date) {
        return date.getTime()
    }

    longToDate(no)
    {
        //return new Date(no)
        return moment(no);
        //return moment.unix(1318781876);
    }

    lastSecondsFromNowToLong(seconds)
    {
       // let date = moment().subtract(seconds, 'seconds'); //new Date()
        //seconds = seconds;//+ 3*60*60;
        var date = moment().subtract(seconds, 'seconds');
        var offset = (new Date()).getTimezoneOffset();
        console.log(offset);
        //var date = moment().utc().subtract(seconds, 'seconds');

        var unix = date.unix();
        //unix = unix + offset * 60 * 1000;
        //console.log(unix);
        //date = moment().utc(date);
        //console.log(date);
        //return this.dateToLong(date);
        //return date.unix() * 1000;
        return unix*1000;
    }

    lastSecondsCustom(custom)
    {
        let seconds = 0;
        let no = 1;
        let intervalType = custom;

        if(custom.indexOf('-')>0)
        {
            const splited = custom.split('-');
            no = splited[0];
            intervalType = splited[1];
        }

        switch (intervalType)
        {
            case 's':
            {
                seconds = no;//24 * 60 * 60;
                break;
            }

            case 'min':
            {
                seconds = no * 60;//24 * 60 * 60;
                break;
            }
            case 'd':
            {
                seconds = no * 86400;
                break;
            }
            case 'w':
            {
                seconds = no * 604800;
                break;
            }
            case 'm':
            {
                return moment().subtract('months', no).unix();
                break;
            }
            case 'y':
            {
                return moment().subtract('year', no).unix();
                break;
            }
            case 'all':
            {
                break;
            }
        }
        return this.lastSecondsFromNowToLong(seconds);
    }

    isInteger(x) {
        return (typeof x === 'number') && (x % 1 === 0)
    }
}

module.exports = new Utils();
