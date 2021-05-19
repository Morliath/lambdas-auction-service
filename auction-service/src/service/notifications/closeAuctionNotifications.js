import { buildMessage } from './buildMessage'

export function closeAuctionNotifications(auction) {
    const { title, seller, highestBid } = auction;
    const { amount, bidder } = highestBid;

    let notifications = [];

    if (bidder) {
        const notifySeller = buildMessage('Your item has been sold', seller, `Your item ${title} has been sold for ${amount}`);
        const notifyBidder = buildMessage('You won an auction', bidder, `You won item ${title} with highest bid of ${amount}`);

        notifications.push(notifySeller, notifyBidder);

    } else {
        notifications.push(buildMessage('No bids on your auction', seller, `Your item ${title} has no bids and got expired`))
    }

    Promise.all(notifications);
}