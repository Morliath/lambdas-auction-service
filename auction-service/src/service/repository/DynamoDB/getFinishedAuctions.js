import AWS from 'aws-sdk';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getFinishedAuctions() {
    const now = new Date();

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endsAt <= :now',
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString(),
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    }

    let result;

    try {
        result = await dynamodb.query(params).promise();
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return result.Items;
}