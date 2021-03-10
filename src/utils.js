const request = require('request')
const fs = require('fs')
const { articleIdParam, courseInfoParam } = require('./config')
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
            body: articleIdParam//post参数字符串
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
                "cookie": "LF_ID=1587952689976-7701915-6340742; _ga=GA1.2.1228968440.1587952690; _gid=GA1.2.597630278.1615216688; GCID=a736378-dd12109-3fbbfe9-c2b45d1; GRID=a736378-dd12109-3fbbfe9-c2b45d1; acw_tc=2760828316153433878708445e92071b0f2c6fd91196f14a25f00b47aa4acd; gksskpitn=ac4182f4-b8fd-48f3-b596-bd62f6fdc106; GCESS=BQoEAAAAAAUEAAAAAAgBAwkBAQYEviqT9gEIXrMgAAAAAAACBCwvSGALAgUAAwQsL0hgBAQALw0ABwSyLr1cDAEB; Hm_lvt_59c4ff31a9ee6263811b23eb921a5083=1615303739,1615304646,1615343384,1615343401; Hm_lvt_022f847c4e3acd44d4a2481d9187f1e6=1615303739,1615304646,1615343384,1615343401; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%222143070%22%2C%22first_id%22%3A%22178179ae2b3cda-0dbcd0c6d788-53e356a-2304000-178179ae2b4c70%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E5%BC%95%E8%8D%90%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Faccount.infoq.cn%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Ftime.geekbang.org%2Fdashboard%2Fusercenter%22%2C%22%24latest_utm_source%22%3A%22time_app%22%2C%22%24latest_utm_medium%22%3A%22winterzhuanlantuijian%22%2C%22%24latest_utm_term%22%3A%22winterzhuanlantuijian%22%7D%2C%22%24device_id%22%3A%22173d7245e71126-01e0a3df09850c-3323765-2304000-173d7245e72a6f%22%7D; SERVERID=3431a294a18c59fc8f5805662e2bd51e|1615343498|1615343387; _gat=1; Hm_lpvt_59c4ff31a9ee6263811b23eb921a5083=1615343495; gk_process_ev={%22count%22:12%2C%22target%22:%22%22%2C%22utime%22:1615343400245%2C%22referrer%22:%22https://time.geekbang.org/%22%2C%22referrerTarget%22:%22%22}; Hm_lpvt_022f847c4e3acd44d4a2481d9187f1e6=1615343495",
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
            url: 'https://time.geekbang.org/serv/v3/column/info ',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Origin": 'https://time.geekbang.org',
                "Referer": 'https://time.geekbang.org'
            },
            body: courseInfoParam
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
    let reg = /[\~\:\/\*\?\"\|\\\<\>]/g
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

