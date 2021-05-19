import AWS from 'aws-sdk';
import createError from 'http-errors'
import { closeAuctionNotifications } from '../../notifications/closeAuctionNotifications'

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    }

    let result;

    try {
        result = await dynamodb.update(params).promise();
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    closeAuctionNotifications(auction);

    return result;
}