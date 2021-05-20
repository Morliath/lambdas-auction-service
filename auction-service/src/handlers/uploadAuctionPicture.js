import middy from '@middy/core';
import validator from '@middy/validator'
import uploadAuctionPictureSchema from '../util/schemas/uploadAuctionPictureSchema'
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors'
import { getAuctionById } from "../service/repository/DynamoDB/getAuctionById";
import { setPictureURL } from '../service/repository/DynamoDB/setPictureURL';
import { uploadPictureToS3 } from "../util/uploadPictureToS3";

async function uploadAuctionPicture(event) {
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);

    const { email } = event.requestContext.authorizer;
    if (email !== auction.seller) {
        throw new createError.Forbidden(`Not the seller of this auction`);
    }

    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const { email } = event.requestContext.authorizer;

    let result;

    try {
        const s3PictureURL = await uploadPictureToS3(auction.id + '.jpg', buffer);
        result = await setPictureURL(id, s3PictureURL);
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ result }),
    }
}

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler())
    .use(validator({ inputSchema: uploadAuctionPictureSchema }));