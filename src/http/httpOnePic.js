/**
 * 
 *  today one widget http client  
 * 
 */

const http = require('http');
const zlib = require('zlib');
const querystring = require('querystring');
const fs = require('fs');
const fileTools = require('../util/fileTools');


/**
 * get today one from datetime and then write it to json file.
 * @param {*} dateTime 
 */
function OneAPI(dateTime) {

    const params = {
        platform: 'ios',
        sign: '3dd5b32c7ace7e2232adba501f4d6cac',
        user_id: '8086636',
        uuid: '9F6277D3-D15C-4939-ABB1-7167CDB8FFEC',
        version: 'v5.1.2'
    }

    const options = {
        hostname: 'v3.wufazhuce.com',
        port: 8000,
        path: '/api/channel/one/' + dateTime + '/0?' + querystring.stringify(params),
        method: 'get',
        headers: {
            'HOST': 'frodo.douban.com',
            'User-Agent': 'User-Agent: ONE/5.1.2 (iPhone; iOS 14.2; Scale/2.00)',
            'Accept': '*/*',
            'Accept-Language': 'Accept-Language: zh-Hans-CN;q=1, en-CN;q=0.9, ja-CN;q=0.8, zh-Hant-CN;q=0.7',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
        }
    }

    let month = dateTime.split('-')[1];

    http.get(options, function (res) {
        const statusCode = res.statusCode;
        if (statusCode === 200) {
            // console.log(res.headers['content-type']);
            // console.log(res.headers['content-encoding']);
            let chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                let buffer = Buffer.concat(chunks);
                // async gzipDecompress
                zlib.gunzip(buffer, (err, decoded) => {
                    if (err) throw err;
                    // make json beautify
                    const data = JSON.stringify(JSON.parse(decoded), null, 4);
                    const folderPath = './data/json/One/' + month;
                    console.log(folderPath);
                    const ret = fileTools.dirExists(folderPath);
                    ret.then(() => {
                        fs.writeFile(folderPath + '/one-' + dateTime + '.json', data, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log('JSON data saved!');
                        })
                    });

                });
                // excute before gzipDecompress
                console.log('end...');
            });

        }
    });
}

module.exports.OneAPI = OneAPI;

