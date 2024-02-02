import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const client = new S3Client({ region: 'myregion' })

export const handler = async (event) => {
  var randomint = function (max) {
    return Math.floor(Math.random() * max)
  }
  var number = randomint(2)
  if (number == 1) {
    const input = {
      Bucket: '<bucketName>>',
      Key: 'myOwn.png'
    }
    try {
      const command = new GetObjectCommand(input)
      const response = await client.send(command)
      var str = await response.Body.transformToByteArray()
    } catch (err) {
      console.error(err)
    }
    const base64body = Buffer.from(str).toString('base64')
    return {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition'
      },
      statusCode: 200,
      body: base64body,
      isBase64Encoded: true
    }
  } else {
    return {
      headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' },
      statusCode: 200,
      body: '<h1>This is text</h1>'
    }
  }
}
