import AWS from 'aws-sdk';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionsByStatus(status) {
    let auctions;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status,
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    }

    try {
        const result = await dynamodb.query(params).promise();

        auctions = result.Items;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return auctions;
}