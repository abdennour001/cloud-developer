import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
// import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { generateUploadUrl } from '../../businessLogic/todos'

// const s3 = new AWS.S3({
//   signatureVersion: 'v4'
// })
// const bucketName = process.env.IMAGES_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

const logger = createLogger('generate-upload-url')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('get upload url for todo', todoId)
//   const url = getUploadUrl(todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
//   logger.info('Url is ', url)

  logger.info('Update Todo attachmentUrl')

    const url = await generateUploadUrl(todoId, getUserId(event))

//   await docClient
//     .update({
//       TableName: todosTable,
//       Key: {
//         todoId,
//         userId: getUserId(event)
//       },
//       UpdateExpression: 'set attachmentUrl = :url',
//       ExpressionAttributeValues: {
//         ':url': `https://${bucketName}.s3.amazonaws.com/${todoId}`
//       },
//       ReturnValues: 'UPDATED_NEW'
//     })
//     .promise()

  logger.info('Todo Updated')

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

// function getUploadUrl(todoId: string) {
//   return s3.getSignedUrl('putObject', {
//     Bucket: bucketName,
//     Key: todoId,
//     Expires: urlExpiration
//   })
// }
