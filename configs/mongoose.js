const mongoose = require("mongoose");
const dbConfig = require("./db.config");
const conxn = dbConfig.conxnUrl + "/" + dbConfig.dbname;

// mongoose.connect(
//   conxn,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err, done) {
//     if (err) {
//       console.log("Error connecting to db >>" + err);
//     } else {
//       console.log("db connection success");
//     }
//   }
// );

mongoose.connect(
  "mongodb+srv://debid:D4v!d123@cluster0.bumti.mongodb.net/ocemQuiz?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, done) {
    if (err) {
      console.log("Error connecting to db >>" + err);
    } else {
      console.log("db connection success");
    }
  }
);
