import AWS from 'aws-sdk';
import createError from 'http-errors'
import { v4 as uuid } from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function saveAuction(title, email) {
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);
    let result;

    const auction = {
        id: uuid(),
        title,
        status: 'OPEN',
        createdAt: now.toISOString(),
        endsAt: endDate.toISOString(),
        highestBid: {
            amount: 0,
        },
        seller: email,
    };

    try {
        result = await dynamodb.put({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Item: auction,
        }).promise();

    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return result;
}