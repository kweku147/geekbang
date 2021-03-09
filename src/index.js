const { getArticle, getArticlesId } = require('./utils')

async function getArticles() {
    const ids = await getArticlesId()
    for (let i = 0; i < ids.length; i++) {
        console.log(`正在下载第${i + 1}个,ID为${ids[i].id}`);
    }
}

getArticles()