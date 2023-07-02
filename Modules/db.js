const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://minhquan:quan1452003@phamminhquan145.ilzcilm.mongodb.net/MunnectDB')
  .then(() => {
    console.log(` Database connect successfully.`);
  })
  .catch((ex) => {
    console.log("Error SQL: " + ex);
  });

module.exports = { mongoose };