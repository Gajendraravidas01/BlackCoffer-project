const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const fs = require('fs');
const path = require('path');
const { error } = require('console');
const { json } = require('body-parser');
const Data = require('./models/Data.js');
require('dotenv').config(); 


const app = express();


app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("database connected !!"))
.catch((error) => console.log(error));

//read json file
const filepath = path.join(__dirname,'Data.json');
fs.readFile(filepath,'utf8',(err,data) => {
  if(err){
    console.log("error in file reading",err);
  }
  try {
    const jsonData = JSON.parse(data);
    Data.insertMany(jsonData)
    .then(() => {
      console.log('data successfully inserted')
      // mongoose.connection.close();
    })
  } catch (error) {
    console.error('error inserting data',error)
  }
})


// Routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
