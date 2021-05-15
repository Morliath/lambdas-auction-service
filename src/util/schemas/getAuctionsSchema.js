const schema = {
    type: 'strict',
    properties: {
        queryStringParams: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSED'],
                    default: 'OPEN',
                }
            }
        }
    },
    required: [
        'queryStringParams',
    ],
}

export default schema;