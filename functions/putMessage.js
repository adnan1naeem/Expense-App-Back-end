const AWS = require("aws-sdk");
const uuid = require("uuid");
const reverser = require("../layers/reverse/index.js");
const dynamodb = new AWS.DynamoDB();

module.exports.putMessage = (event, context, callback) => {
  let message = "";
  if (event.body) {
    message = JSON.parse(event.body).message;
    expense = JSON.parse(event.body).expense;
    date =
      (
        JSON.parse(event.body).date && new Date(JSON.parse(event.body).date)
      ).toString() || "";
    console.log(date);
  } else {
   
    message = event.message;
  }
  dynamodb.putItem(
    {
      TableName: process.env.DDB_TABLE_NAME,
      Item: {
        id: {
          S: uuid.v4(),
        },
        message: {
          S: reverser.reverseString(message),
        },
        expense: {
          S: reverser.reverseString(expense),
        },
        date: {
          S: reverser.reverseString(date),
        },
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        callback(null, {
          statusCode: 400,
          body: JSON.stringify({ error: err }),
        });
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ status: "success" }),
        });
      }
    }
  );
};
