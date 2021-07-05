module.exports = {
    unixtotime: function (unix_timestamp) {
        let date = new Date(unix_timestamp * 1000);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        //let seconds = date.getSeconds();

        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        //seconds = secends < 10 ? '0' + secends : secends;
        return hours + ':' + minutes + ' ' + ampm;
    },
    unixtodate: function (unix_timestamp) {
        let date = new Date(unix_timestamp * 1000);

        let m = (date.getMonth() + 1);
        if (m < 10) m = '0' + m
        let d = (date.getDate());
        if (d < 10) d = '0' + d
        return m + '.' + d + '.' + date.getFullYear();
    },
    numberFormat: function (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    mstoTime: function (s) {
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        let hrs = (s - mins) / 60;

        return hrs + 'h **:** ' + mins + 'm **:** ' + secs + 's';
    },
    titleCase: function (str) {
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    },
    decrease_brightness: function (hex, percent) {
        let r = parseInt(hex.substr(1, 2), 16),
            g = parseInt(hex.substr(3, 2), 16),
            b = parseInt(hex.substr(5, 2), 16);

        return '#' +
            ((0 | (1 << 8) + r * (100 - percent) / 100).toString(16)).substr(1) +
            ((0 | (1 << 8) + g * (100 - percent) / 100).toString(16)).substr(1) +
            ((0 | (1 << 8) + b * (100 - percent) / 100).toString(16)).substr(1);
    },
    monthToSeasson: function (date) {
        let newDate = new Date(date)
        let m = 3;
        let y = 16
        let season = 0;
        while (true) {
            season++;
            if (newDate.getMonth() === m + 1 && newDate.getFullYear() === 2000 + y) {
                return season + 1;
            } else if (m >= 12) {
                y++;
                m = 1;
            } else {
                m++;
            }
        }
    },
    seassonToMonth: function (seasson) {
        let m = 3;
        let y = 16
        let oldSeason = 0;
        while (true) {
            oldSeason++;
            if (seasson === oldSeason) {
                return new Date(2000 + y, m, 1, 0, 0, 0, 0);
            } else if (m >= 12) {
                y++;
                m = 1;
            } else {
                m++;
            }
        }
    }

}