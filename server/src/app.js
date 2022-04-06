const express = require('express');
const cors = require('cors');

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/v1', api);

// for handling 401 and internal server error
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


app.listen(5000, ()=>{
    console.log(`Listening: http://localhost:${port}`);
})