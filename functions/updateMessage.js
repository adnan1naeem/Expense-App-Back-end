const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

module.exports.updateMessage = (event, context, callback) => {
  let id = "";
  let updatedMessage = "";
  let updatedExpense = "";
  let updatedDate = "";

  if (event.body) {
    const requestBody = JSON.parse(event.body);
    id = requestBody.id;
    updatedMessage = requestBody.message;
    updatedExpense = requestBody.expense;
    updatedDate =
      (requestBody.date && new Date(requestBody.date).toString()) || "";
  } else {
    id = event.id;
    updatedMessage = "";
    updatedExpense = "";
    updatedExpense = "";
  }

  dynamodb.updateItem(
    {
      TableName: process.env.DDB_TABLE_NAME,
      Key: {
        id: {
          S: id,
        },
      },
      UpdateExpression:
        "SET #message = :updatedMessage,#expense = :updatedExpense,#date = :updatedDate",
      ExpressionAttributeNames: {
        "#message": "message",
        "#date": "date",
        "#expense": "expense",
      },
      ExpressionAttributeValues: {
        ":updatedMessage": {
          S: updatedMessage,
        },
        ":updatedExpense": {
          S: updatedExpense,
        },
        ":updatedDate": {
          S: updatedDate,
        },
      },
      ReturnValues: "ALL_NEW",
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
          body: JSON.stringify({
            status: "success",
            updatedItem: data.Attributes,
          }),
        });
      }
    }
  );
};
