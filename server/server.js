const app=require('./app.js');

const PORT = process.env.PORT || 3060;

app.listen(PORT, function() {
    console.log(`Server started at ${PORT}...`);
})
