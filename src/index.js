const fs = require('fs');
const path = require('path');
const canvasTextLine = require('./util/canvasTextLineFeed');
const { createCanvas, loadImage } = require('canvas');
const fileTools = require('./util/fileTools');


const filePath = './data/json/One/12';

/**
 * sleep current task 
 * @param {*} ms 
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

function readJsonFiles(filePath) {

    let state = fs.statSync(filePath);
    if (state.isFile()) {
        // fs.readFile(filePath, "utf-8", function (err, data) {
        //     let json = JSON.parse(data);
        //     nodeCanvasToImage(json);
        // });
        let jsonStr = fs.readFileSync(filePath, 'utf-8');
        nodeCanvasToImage(JSON.parse(jsonStr));
    } else if (state.isDirectory()) {
        let files = fs.readdirSync(filePath);
        files.forEach(async (file, index) => {
            await wait(2000 * index);
            // console.log(filePath);
            readJsonFiles(path.join(filePath, file));
        });
    }
}

readJsonFiles(filePath);

function nodeCanvasToImage(json) {

    const picInfo = {};
    const contentList = json.data.content_list[0];
    picInfo.content = contentList.forward;
    picInfo.poster = contentList.img_url;// 1022*574
    picInfo.title = contentList.words_info;
    picInfo.card_subtitle = contentList.title + " | " + contentList.pic_info;
    picInfo.today = picInfo.today || {};
    picInfo.today.date = json.data.date.split(" ")[0];
    picInfo.today.title = contentList.volume;

    const canvasWidth = 860;
    const canvasHeight = 1200;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = 'rgba(245, 245, 245, 1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Load image then create canvas, draw text and output png file.
    loadImage(picInfo.poster).then((image) => {

        const textLeftPx = canvasWidth / 2;
        ctx.fillStyle = 'rgba(40, 42, 44, 0.75)';
        ctx.font = '40px Microsoft Yahei';
        ctx.textAlign = 'center';
        ctx.fillText(picInfo.today.date, textLeftPx, 80);
        ctx.font = '30px Microsoft Yahei';
        ctx.fillText(picInfo.today.title, textLeftPx, 150);

        ctx.drawImage(image, 0, 200, canvasWidth, 574);

        ctx.font = '20px Microsoft Yahei';
        ctx.fillText(picInfo.card_subtitle.replace('\n', ' '), textLeftPx, 840);

        const contentHeight = 920;
        const lineHeight = 40;
        const linePadding = 60;

        // Split a string to many lines, fillText not support new line. :(
        const resultLines = canvasTextLine.breakLinesForCanvas(ctx, picInfo.content, canvasWidth - linePadding, '30px Microsoft Yahei');
        resultLines.forEach(function (line, index) {
            ctx.fillText(line, textLeftPx, contentHeight + lineHeight * index);
        });

        ctx.font = '26px Microsoft Yahei';
        ctx.fillText(picInfo.title, textLeftPx, contentHeight + lineHeight * resultLines.length + 50);

        const stream = canvas.createPNGStream();
        let month = picInfo.today.date.split('-')[1];
        const folderPath = './data/images/onePic/' + month + '/';
        const dirExistStatus = fileTools.dirExists(folderPath);
        dirExistStatus.then(() => {
            const out = fs.createWriteStream(folderPath + picInfo.today.date + '.png');
            stream.pipe(out);
            out.on('finish', () => console.log('The PNG file was created.'));
            out.on('error', (err) => console.log('create write stream error!', err));
        });

    }).catch(err => {
        console.log('load image error!', err);
    });

}

