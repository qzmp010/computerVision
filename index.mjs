import express from 'express';
import fetch from 'node-fetch';
const planets = (await import('newsapi')).default;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index")
});

app.listen(3000, () => {
    console.log('server started');
});
