import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getFinishedAuctions() {
    const now = new Date();

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endsAt <= :now',
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString(),
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    }

    const result = await dynamodb.query(params).promise();

    return result.Items;
}

export async function closeAuction(auction) {
    const sqs = new AWS.SQS();
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

    const result = await dynamodb.update(params).promise();

    const { title, seller, highestBid } = auction;
    const { amount, bidder } = highestBid;

    if(bidder){
        const notifySeller = buildMessage('Your item has been sold', seller, `Your item ${title} has been sold for ${amount}`);
        const notifyBidder = buildMessage('You won an auction', bidder, `You won item ${title} with highest bid of ${amount}`);
        Promise.all([notifySeller, notifyBidder]);

        return result;
    } else {
        await buildMessage('No bids on your auction', seller, `Your item ${title} has no bids and got expired`);
        return;
    }

}

function buildMessage(subject, recipient, body) {
    return sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject,
            recipient,
            body,
        })
    }).promise();
}