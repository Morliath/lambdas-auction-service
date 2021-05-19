import AWS from 'aws-sdk';

const sqs = new AWS.SQS();

export function buildMessage(subject, recipient, body) {
    return sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject,
            recipient,
            body,
        })
    }).promise();
}