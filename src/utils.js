const request = require('request')

function getArticlesId() {
    const requestData = '{"cid":"216","size":500,"prev":0,"order":"earliest","sample":false}'
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v1/column/articles',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Referer": "https://time.geekbang.org/column/article/216",
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

function getArticle(id) {
    const requestData1 = `{"id": ${id},"include_neighbors": true,"is_freelyread": true}`
    return new Promise((resolve, reject) => {
        request({
            url: 'https://time.geekbang.org/serv/v1/article',
            method: "POST",
            headers: {
                "content-type": "application/json",
                "referer": `https://time.geekbang.org/column/article/${id}`,
            },
            body: requestData1//post参数字符串
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const res = JSON.parse(response.body)
                resolve(res.data)
            }
        });
    })
}

function saveArticle(title, content, template) {
    template.replace(/{{title}}/, title)
    template.replace(/{{content}}/, content)
}

module.exports = {
    getArticlesId,
    getArticle,
    saveArticle
}