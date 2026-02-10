import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, ScanCommand, GetCommand, DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TableName = process.env.TABLE_NAME;
const tableLength = 57; // work-around
let Event;

export const handler = async (event) => {
  Event = event;
  switch (Event['httpMethod']) {
    case 'POST':
      return doPost();
    case 'PUT':
      return doPost(parseInt(event.queryStringParameters.id));
    case 'GET':
      return event.queryStringParameters ? getOne() : getAll();
    case 'DELETE':
      return doDelete(parseInt(event.queryStringParameters.id));
  }
};

// Create and format the response that API Gateway w/Lambda integration expects
function createResponse(tableResponse) { 
  const response = { 
    statusCode: tableResponse.$metadata.httpStatusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(tableResponse), // Stringify the JSON object
  };
  return response; 
}

// CREATE or UPDATE
async function doPost(id = null) {
  const body = JSON.parse(Event.body);
  const item = {
    ...body,
    ...(id && { id }), // path param wins
  };
  const command = new PutCommand({
    TableName,
    Item: item,
  });
  return queryTable(command);
}

// RETRIEVE
async function getAll() { 
  const command = new ScanCommand({
    ProjectionExpression: "#source, #id, quote, speaker",
    ExpressionAttributeNames: { "#source": "source", "#id": "id" },
    TableName
  });
  return queryTable(command);
}

async function getOne() { 
  let id = parseInt(Event.queryStringParameters.id);
  if (id === 0) {
    id = Math.floor(Math.random() * tableLength) + 1;
  }
  const command = new GetCommand({
    TableName,
    Key: {
      id
    },
  });
  return queryTable(command);
}

// DELETE
async function doDelete(id) {
  const command = new DeleteCommand({
    TableName,
    Key: { id },
  });
  return queryTable(command);
}

async function queryTable(command) {
  try {
    const response = await docClient.send(command);
    return createResponse(response); 
  } catch (error) {
    console.error(error);
    return createResponse(error);
  }
}
 
