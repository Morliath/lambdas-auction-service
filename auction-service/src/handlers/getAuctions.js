import commonMiddleware from '../util/commonMiddleware'
import validator from '@middy/validator'
import getAuctionsSchema from '../util/schemas/getAuctionsSchema'
import { getAuctionsByStatus } from '../service/repository/DynamoDB/getAuctionsByStatus'

async function getAuctions(event, context) {

    const { status } = event.queryStringParameters;

    const auctions = await getAuctionsByStatus(status);

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions)
    .use(validator({ inputSchema: getAuctionsSchema, useDefaults: true }));