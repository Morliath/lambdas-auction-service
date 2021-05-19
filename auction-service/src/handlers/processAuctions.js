import { getFinishedAuctions } from '../service/repository/DynamoDB/getFinishedAuctions'
import { closeAuction } from '../service/repository/DynamoDB/closeAuction'

async function processAuctions(event, context) {
    const auctionsToClose = await getFinishedAuctions();
    const closePromises = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closePromises);

    return { closed: closePromises.length };
}

export const handler = processAuctions;