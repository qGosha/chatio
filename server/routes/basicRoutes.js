const axios = require('axios');

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send('you are not logged in').redirect('/login');
    }
}
module.exports = (app) => {
  app.get('/', loggedIn, (req, res) => {
    res.status(200);
  });
  app.post('/api/search/city', async (req, res) => {
    try {
     const results = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.body.value}&types=(cities)&key=${process.env.GOOGLE_API_KEY}`);
     if(results && results.data.predictions) {
       res.send({
         success: true,
         results: results.data.predictions
       })
     }
   } catch (error) {
     res.send({
       success: false,
       error
     })
   }
  });
}
