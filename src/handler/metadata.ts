import { metaDataTableclient } from '../utils/metadata-table-client'
const { AWS_REGION, METADATA_TABLE_NAME } = process.env;
if (!METADATA_TABLE_NAME) {
    throw new Error("Tablename not defined")
}
if (!AWS_REGION) {
    throw new Error("AWS Region not defined")
}
const metaTableClient = new metaDataTableclient(METADATA_TABLE_NAME, AWS_REGION);

export const handler: any = async (event: any) => {
    let res = {};
    try {
        const requestJson = JSON.parse(event.body)
        console.debug(event.body);
        await metaTableClient.writeRecord(requestJson).then(() => {
            res = {
                statusCode:200,
                body: JSON.stringify({
                    status: "Success"
                })
            }
        }).catch((error) => {
            res = {
                statusCode:500,
                body:JSON.stringify( {
                    status: "Fail",
                    error:error
                })
            }
        });

    } catch (error) {
        console.error(error);
        res = {
            statusCode:500,
            body: JSON.stringify({
                status: "Fail",
                error:error
            })
        }
    }
    return res;
}





