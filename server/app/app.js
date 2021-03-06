const express = require('express');
const path = require('path');

const app = require('../index');
const env = app.get('env');

if (env === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build/')));

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../../client/build/index.html'))
  );
}

// connect to database
require('../util/db');

// prepare search index
require('../util/search');

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`${env} server started on port: ${PORT}`));
