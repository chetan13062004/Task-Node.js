const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userController=require('./controllers/user')
const cors=require('cors')
const app = express();
app.use(cors())
const port = 3000;

mongoose.connect('mongodb://localhost:27017/task', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected...');
  })
  .catch((err) => {
    console.log('Connection error', err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup',userController.signup)

app.post('/signin',userController.signin)

app.post('/forgot',userController.forgotPass)

// app.post('/sendotp',userController.otp)

// app.post('/submitotp',userController.submitotp)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
