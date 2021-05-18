import { getFinishedAuctions,  closeAuction}  from '../service/auctions'
import createError from 'http-errors'

async function processAuctions(event, context) {
    try {
        const auctionsToClose = await getFinishedAuctions();
        const closePromises = auctionsToClose.map( auction => closeAuction(auction));
        await Promise.all(closePromises);

        return { closed: closePromises.length};
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

}

export const handler = processAuctions;