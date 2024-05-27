import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand, GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)
const TableName = 'Quotes'
const tableLength = 24
let Event

export const handler = async (event) => {
  Event = event
  switch (Event['httpMethod']) {
    case 'POST':
      return doPost()
    case 'GET':
      return event.queryStringParameters ? getOne() : getAll()
  }
}

function createResponse(tableResponse) {
  const response = {
    statusCode: tableResponse.$metadata.httpStatusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(tableResponse) // Stringify the JSON object
  }
  return response
}

async function doPost() {
  const command = new PutCommand({
    TableName,
    Item: JSON.parse(Event.body)
  })
  try {
    const response = await docClient.send(command)
    return createResponse(response)
  } catch (error) {
    console.error(error)
    return createResponse(error)
  }
}

async function getAll() {
  const command = new ScanCommand({
    ProjectionExpression: '#source, #id, quote, speaker',
    ExpressionAttributeNames: { '#source': 'source', '#id': 'id' },
    TableName
  })
  try {
    const response = await docClient.send(command)
    return createResponse(response)
  } catch (err) {
    console.error(err)
    return createResponse(err)
  }
}

async function getOne() {
  let id = parseInt(Event.queryStringParameters.id)
  if (id === 0) {
    id = Math.floor(Math.random() * tableLength) + 1
  }
  const command = new GetCommand({
    TableName,
    Key: {
      id
    }
  })
  try {
    const response = await docClient.send(command)
    return createResponse(response)
  } catch (err) {
    console.error(err)
    return createResponse(err)
  }
}
