import {
    AttributeValue,
    DynamoDBClient,
    ScanCommand,
  } from '@aws-sdk/client-dynamodb';
  
  async function scanRecursive({
    client,
    table,
    filter,
    expressionAttributeNames,
    expressionAttributeValues,
    exclusiveStartKey,
  }: {
    client: DynamoDBClient;
    table: string;
    filter?: string;
    expressionAttributeNames?: Record<string, string>;
    expressionAttributeValues?: Record<string, AttributeValue>;
    exclusiveStartKey?: Record<string, AttributeValue>;
  }): Promise<Record<string, AttributeValue>[]> {
    const request = new ScanCommand({
      TableName: table,
      FilterExpression: filter,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ExclusiveStartKey: exclusiveStartKey,
    });
    console.log(JSON.stringify(request));
  
    const response = await client.send(request);
    const items = response.Items ?? [];
    if (response.LastEvaluatedKey) {
      return items.concat(
        await scanRecursive({
          client,
          table,
          filter,
          expressionAttributeNames,
          expressionAttributeValues,
          exclusiveStartKey: response.LastEvaluatedKey,
        }),
      );
    }
    return items;
  }
  
  export async function scan({
    table,
    filter,
    expressionAttributeNames,
    expressionAttributeValues,
  }: {
    table: string;
    filter?: string;
    expressionAttributeNames?: Record<string, string>;
    expressionAttributeValues?: Record<string, AttributeValue>;
  }) {
    const dynamodb = new DynamoDBClient({region: 'us-west-2'});
    if (dynamodb) {
      return await scanRecursive({
        client: dynamodb,
        table,
        filter,
        expressionAttributeNames,
        expressionAttributeValues,
      });
    }
    return undefined;
  }
  