const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes')
const databaseConfig  = require('./database/config')
require('dotenv').config()


databaseConfig.connect((err) =>{
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Database Connected`)
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors())


app.use('/', routes)

app.get('/', async (req, res) => {
  try {
    res.send(`Welcome disinfolahta`);
  } catch (error) {
    console.log(error);;
  }
});


PORT = process.env.PORT || 3000
app.listen(PORT, () => {console.log(`Application is running on ${PORT}!! `)})