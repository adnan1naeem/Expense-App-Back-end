const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

module.exports.removeMessage = (event, context, callback) => {
  let id = "";
  if (event.body) {
    id = JSON.parse(event.body).id;
  } else {
    id = event.id;
  }

  dynamodb.deleteItem(
    {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        id: {
          S: id,
        },
      },
    },
    (err, data) => {
      if (err) {
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
