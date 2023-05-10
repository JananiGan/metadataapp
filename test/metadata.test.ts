const mockWriteRecord = jest.fn().mockResolvedValue(Promise.resolve());;
jest.mock('../src/utils/metadata-table-client', () => ({
    metaDataTableclient: jest.fn(() => ({
        writeRecord: mockWriteRecord,
    }))
}))


describe('Metadata Handler', () => {
    beforeEach(() => {
        process.env.AWS_REGION = 'asdf'
        process.env.METADATA_TABLE_NAME = 'asdftable'
    });

    afterEach(() => {
        delete process.env.AWS_REGION;
        delete process.env.METADATA_TABLE_NAME;
    });

    it('writes the metadata to the Metadata table in dynamodb', async () => {
        const mockEvent = {
            "body": JSON.stringify({
                filename: "test",
                metadata: {
                    duration: "23s",
                    size: "2MB"
                }
            })
        }

        const { handler } = await import('../src/handler/metadata');
        const res = await handler(mockEvent);
        expect(res.statusCode).toEqual(200);

    })
})