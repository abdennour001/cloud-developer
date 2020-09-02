import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const logger = createLogger('update-todo')

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const createdAt = JSON.parse(event.body)['createdAt']

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  logger.info('update todo ', updatedTodo)
  const data = await docClient
    .update({
      TableName: todosTable,
      Key: {
        todoId,
        createdAt
      },
      UpdateExpression: 'set attachmentUrl = :url',
      ExpressionAttributeValues: {
        ':url': updatedTodo['attachmentUrl']
      },
      ReturnValues: 'UPDATED_NEW'
    })
    .promise()

  logger.info('Todo updated ', data)

  if (data) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(JSON.stringify(data, null, 2))
    }
  } else {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(`Unable to update item.`)
    }
  }

  return undefined
}
