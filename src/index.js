const { getArticle, getArticlesId, getCourseInfo, saveArticle } = require('./utils')
const fs = require('fs')

async function getArticles() {
    const ids = await getArticlesId()
    const title = await getCourseInfo()
    for (let i = 0; i < ids.length; i++) {
        console.log(`正在下载第${i + 1}个,ID为${ids[i].id}...`);
        const content = await getArticle(ids[i].id)
        const { article_content, article_title } = content
        saveArticle(title, `${i}.${article_title} `, article_content)
    }
    console.log('下载完成！');
}

getArticles()