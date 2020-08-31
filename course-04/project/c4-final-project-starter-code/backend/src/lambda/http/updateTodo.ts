import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  docClient.update(
    {
      TableName: todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set name = :name, dueDate=:dueDate, done=:done',
      ExpressionAttributeValues: {
        ':name': updatedTodo['name'],
        ':dueDate': updatedTodo['dueDate'],
        ':done': updatedTodo['done']
      },
      ReturnValues: 'UPDATED_NEW'
    },
    function(err, data) {
      if (err) {
        console.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2)
        )
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(
            `Unable to update item. Error JSON: ${JSON.stringify(err, null, 2)}`
          )
        }
      } else {
        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(JSON.stringify(data, null, 2))
          }
      }
    }
  )
  return undefined
}
