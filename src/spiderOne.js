
const httpOnePic = require('./http/httpOnePic');

/**
 * get date object from year-month-day format string 
 * @param {*} datestr 
 */
function getDate(datestr) {
    let temp = datestr.split("-");
    let date = new Date(temp[0], temp[1] - 1, temp[2]);
    return date;
};

/**
 * sleep current task 
 * @param {*} ms 
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

let start = "2020-12-23";
let end = "2020-12-31";
let startTime = getDate(start);
let endTime = getDate(end);

; (async () => {
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
        let year = startTime.getFullYear();
        let monthStr = startTime.getMonth() + 1;
        let month = monthStr.toString().length === 1 ? "0" + monthStr : monthStr;
        let day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
        let dateTime = year + "-" + month + "-" + day;
        console.log(dateTime);
        httpOnePic.OneAPI(dateTime);
        //startTime.setTime(startTime.getTime() + 24*60*60*1000);
        startTime.setDate(startTime.getDate() + 1);
        await wait(2000);
    }
})();

