
import commonMiddleware from '../util/commonMiddleware'
import validator from '@middy/validator'
import createAuctionSchema from '../util/schemas/createAuctionSchema'
import { saveAuction } from '../service/repository/DynamoDB/saveAuction'

async function createAuction(event, context) {
  const { title } = event.body;
  const { email } = event.requestContext.authorizer;

  await saveAuction(title, email);

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction)
  .use(validator({ inputSchema: createAuctionSchema }));