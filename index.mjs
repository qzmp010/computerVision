import express from 'express';
import fetch from 'node-fetch';
const newsApi = (await import('newsapi')).default;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// active page tracker
app.use((req, res, next) => {
  res.locals.activePage = req.path.split('/')[1] || 'home';
  next();
});

app.get('/', async (req, res) => {
    let randomImage;
    try {
        const apiKey = "aHzCm7p89Sp87H7h_oZc8eyXMXstvdK7HxwTfXvrvKY";
        const query = "computer-vision"
        let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=${query}`;
        let response = await fetch(url);
        let data = await response.json();
        randomImage = data.urls.full;
    } catch (err) {
        //default image if rate limit exceeded or other errors
        randomImage = "img/sm-coloradan_fall23_half1.webp";
        console.error(err);
    }
    res.render("index", { "image": randomImage })
});

app.get('/how_it_works', (req, res) => {
    res.render("howItWorks")
});

app.get('/applications', (req, res) => {
    res.render("applications")
});

app.get('/challenges_and_future', (req, res) => {
    res.render("challengesAndFuture")
});

// Get top 10 most relevant articles from NewsAPI
app.get('/news_feed', async (req, res) => {
    try {
        const apiKey = 'a165d7c2084d4d89a70b7031361fff91';
        const newsFeed = new newsApi(apiKey);

        let response = await newsFeed.v2.everything({
            q: '"autonomous vehicle" OR "self driving" OR robotaxi OR "computer vision"',
            language: 'en',
            sortBy: 'relevancy',
            pageSize: 10,
            page: 1,
        });

        console.log(response);
        console.log(`Result count: ${response.articles.length} / ${response.totalResults}`);

        const feed = response.articles.map(r => ({
            source: r.source.name,
            author: r.author,
            title: r.title,
            description: r.description,
            url: r.url,
            urlToImage: r.urlToImage,
            publishedAt: r.publishedAt,
        }));
        res.render("newsFeed", { feed });
    } catch (err) {
        //show error page
        console.error(err);
        res.render("error", { err });
    }
});

app.listen(3000, () => {
    console.log('server started');
});
