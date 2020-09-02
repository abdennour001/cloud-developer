import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const logger = createLogger('create-todo')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()
  // TODO: Implement creating a new TODO item

  // add auth user ID to our todo
  logger.info('Creating a new todo', newTodo)
  let createTodo = {
    todoId,
    userId: getUserId(event),
    createdAt: new Date().toLocaleString(),
    ...newTodo
  }

  await docClient
    .put({
      TableName: todosTable,
      Item: createTodo
    })
    .promise()

  logger.info('Todo created', createTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      createTodo
    })
  }
}
