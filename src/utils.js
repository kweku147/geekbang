const request = require('request')
const fs = require('fs')
const path = require('path')


//课程ids
function getArticlesId() {
    const requestData = '{"cid":"154","size":500,"prev":0,"order":"earliest","sample":false}'
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v1/column/articles',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Referer": "https://time.geekbang.org/column/intro/154",
            },
            body: requestData//post参数字符串
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                const { list } = res.data
                resolve(list)
            }
        });
    })
}

//课程信息
function getCourseInfo() {
    const requestData = '{"product_id":154}'
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v3/column/info ',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Referer": "https://time.geekbang.org/column/intro/154",
            },
            body: requestData
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                const { title } = res.data
                resolve(title)
            }
        });
    })
}
//文章
function getArticle(id) {
    const requestData = `{"id":"${{id}}","include_neighbors":true,"is_freelyread":true}`
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v1/article',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "cookie": "LF_ID=1587952689976-7701915-6340742; _ga=GA1.2.1228968440.1587952690; _gid=GA1.2.597630278.1615216688; GCID=a736378-dd12109-3fbbfe9-c2b45d1; GRID=a736378-dd12109-3fbbfe9-c2b45d1; GCESS=BQQEAC8NAAgBAwwBAQcERBuR7wsCBQAJAQEFBAAAAAADBFKFR2AGBL4qk_YBCF6zIAAAAAAACgQAAAAAAgRShUdg; gksskpitn=ad5f1000-624a-4613-b730-a5fb41d72a0c; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%222143070%22%2C%22first_id%22%3A%22173d7245e71126-01e0a3df09850c-3323765-2304000-173d7245e72a6f%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Ftime.geekbang.org%2Fsearch%3Fq%3D%25E6%25B5%258F%25E8%25A7%2588%25E5%2599%25A8%22%2C%22%24latest_utm_source%22%3A%22time_app%22%2C%22%24latest_utm_medium%22%3A%22winterzhuanlantuijian%22%2C%22%24latest_utm_term%22%3A%22winterzhuanlantuijian%22%7D%2C%22%24device_id%22%3A%22173d7245e71126-01e0a3df09850c-3323765-2304000-173d7245e72a6f%22%7D; Hm_lvt_59c4ff31a9ee6263811b23eb921a5083=1615298979,1615299914,1615299920,1615301467; Hm_lvt_022f847c4e3acd44d4a2481d9187f1e6=1615298979,1615299914,1615299920,1615301467; acw_tc=276082a116153017453818894e70113c821ab6084fa8ac5190961479a91c60; SERVERID=3431a294a18c59fc8f5805662e2bd51e|1615303161|1615301468; Hm_lpvt_59c4ff31a9ee6263811b23eb921a5083=1615303158; Hm_lpvt_022f847c4e3acd44d4a2481d9187f1e6=1615303158; gk_process_ev={%22count%22:18%2C%22target%22:%22%22}; _gat=1",
                "referer": `https://time.geekbang.org/column/article/${{id}}`,
            },
            body: requestData//post参数字符串
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                resolve(res.data)
            }
        });
    })
}
getArticle(123)

function saveArticle(title, articleTitle, content, template) {
    template.replace(/{{title}}/, articleTitle)
    template.replace(/{{content}}/, content)
    fs.writeFile(`./${title}/${articleTitle}.html`, template, function (error) {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('写入成功');
    })
}

module.exports = {
    getArticlesId,
    getArticle,
    saveArticle,
    getCourseInfo
}

