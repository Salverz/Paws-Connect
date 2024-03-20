// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000;
app.use(cors({origin: 'http://localhost:5174'})); // This should be the url for your front end server (the URL you go to to see the website)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router files
const accountRoute = require('./routes/account/account');
const petRoute = require('./routes/pet/pet');
const postRoute = require('./routes/post/post');

// Routers
app.use('/account', accountRoute);
app.use('/pet', petRoute);
app.use('/post', postRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
