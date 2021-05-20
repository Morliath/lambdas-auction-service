import AWS from 'aws-sdk';
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function setPictureURL(id, pictureURL) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set pictureURL = :pictureURL',
        ExpressionAttributeValues: {
            ':pictureURL': pictureURL,
        },
        ReturnValues: 'ALL_NEW',
    }

    let result;

    try {
        result = await dynamodb.update(params).promise();
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return result;
}