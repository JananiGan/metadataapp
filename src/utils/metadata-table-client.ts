import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb'
export class metaDataTableclient {

    private readonly ddbClient: DynamoDBClient
    constructor(private readonly tableName: string, private readonly awsRegion: string) {
        this.ddbClient = new DynamoDBClient({ region: this.awsRegion })
    }

    private readonly marshalItem = (item: any): any => {
        const newItem = {
            metadata: item.metadata,
            id: item.filename
        }
        return marshall(newItem, {
            convertEmptyValues: false,
            convertClassInstanceToMap: true,
            removeUndefinedValues: true
        });
    }

    async writeRecord(item: any) {
        try {
            await this.ddbClient.send(new PutItemCommand({
                TableName: this.tableName,
                Item: this.marshalItem(item)
            })).then((res) => {
                console.info("success")
             }).catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
        }

    }
}