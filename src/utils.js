const request = require('request')
const fs = require('fs')
const { courseId, cookie } = require('./config')
const TurndownService = require('turndown')
const turndownService = new TurndownService()


function randomUserAgent() {
    const userAgentList = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
        'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
        'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
    ]
    const num = Math.floor(Math.random() * userAgentList.length)
    return userAgentList[num]
}

function randomIpAddress() {
    return `211.161.244.${Math.floor(254 * Math.random())}`
}

function getArticlesId() {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v1/column/articles',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Referer": "https://time.geekbang.org",
            },
            body: `{ "cid": ${courseId}, "size": 500, "prev": 0, "order": "earliest", "sample": false }`
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                const { list } = res.data
                resolve(list)
            }
        });
    })
}

function getArticle(id) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v1/article',
            method: "POST",
            headers: {
                "Origin": 'https://time.geekbang.org',
                "Referer": 'https://time.geekbang.org',
                'User-Agent': randomUserAgent(),
                'X-Real-IP': randomIpAddress(),
                "cookie": cookie,
                "Connection": 'keep-alive',
                'Content-Type': 'application/json',
            },
            body: `{"id": ${id},"include_neighbors": true,"is_freelyread": true}`
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                resolve(res.data)
            }
        });
    })
}

function getCourseInfo() {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v3/column/info',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Origin": 'https://time.geekbang.org',
                "Referer": 'https://time.geekbang.org'
            },
            body: `{"product_id":${courseId}}`
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                const { title } = res.data
                resolve(title)
            }
        });
    })
}



function saveArticle(title, articleTitle, content) {
    let reg = /[\~\:\/\*\?\"\|\\\<\>\s]/g
    articleTitle = articleTitle.replace(reg, '')
    content = turndownService.turndown(content)
    fs.stat(title, (err, data) => {
        if (err) {
            fs.mkdirSync(title)
        } else {
            fs.writeFileSync(`${title}/${articleTitle}.md`, content)
        }
    })
}

module.exports = {
    getArticlesId,
    getArticle,
    saveArticle,
    getCourseInfo
}

