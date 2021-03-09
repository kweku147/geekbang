const { getArticle, getArticlesId, getCourseInfo, saveArticle } = require('./utils')
const fs = require('fs')
const { template } = require('./template')

async function getArticles() {
    const ids = await getArticlesId()
    const title = await getCourseInfo()
    fs.existsSync(title, (exists) => {
        if (exists) {
            return
        }
        fs.mkdirSync(title)
    })
    for (let i = 0; i < ids.length; i++) {
        console.log(`正在下载第${i + 1}个,ID为${ids[i].id}...`);
        // await saveArticle(title, article_title, article_content, template)
    }
}

getArticles()