import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,

    private readonly s3 = new AWS.S3({
      signatureVersion: 'v4'
    })
  ) {}

  async getAllTodos(userId): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    console.log('Todos: ', result.Items)
    const todos = result.Items
    return todos as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    console.log('Creating todo')

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async deleteTodo(todoId: string, userId: string): Promise<string> {
    console.log('Deleting Todo')
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { todoId: todoId, userId: userId }
      })
      .promise()

    return todoId
  }

  async updateTodo(todo: TodoUpdate, todoId: string, userId: string) {
    console.log('Updating Todo')
    const data = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId: userId
        },
        UpdateExpression: 'set done = :done',
        ExpressionAttributeValues: {
          ':done': todo['done']
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return data
  }

  async generateUploadUrl(todoId, userId): Promise<string> {
    const url = this.getUploadUrl(todoId)

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId: userId
        },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: {
          ':url': `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return url
  }

  getUploadUrl(todoId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
