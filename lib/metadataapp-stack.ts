import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy, PolicyDocument, ServicePrincipal, Role } from 'aws-cdk-lib/aws-iam';

export class MetadataappStack extends cdk.Stack {
  private readonly baseTableProps={
    billingMode: BillingMode.PAY_PER_REQUEST,
    partitionKey: { 
        name: 'id', 
        type: AttributeType.STRING 
    }
   };

constructor(scope: Construct, id: string, props?: cdk.StackProps) {
   super(scope, id, props);       

   const metaTable=new Table(this,'MetaDataTable',{
    ...this.baseTableProps,
    tableName:"MetaDataTable"
   });

   const handlerRole=new Role(this,'MetadataHandlerRole',{
    roleName: 'metadataHandlerRole',
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies:[
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaDynamoDBExecutionRole')
    ],
   });

   const handler = new lambda.Function(this, 'MyLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      role:handlerRole,
      code: lambda.Code.fromAsset('./src'),
      handler: "handler/metadata.handler",
      environment: {
        METADATA_TABLE_NAME: metaTable.tableName
      }
   })
   metaTable.grantReadWriteData(handler);
   const api = new apigateway.RestApi(this, "metadata-api", {
      restApiName: "Media Metadata Storage Service",
      description: "This service stores the metadata in the dynamodb."
   });
   const postLambdaIntegration = new apigateway.LambdaIntegration(handler);
   api.root.addResource("storemetadata").addMethod('POST',  postLambdaIntegration);
}
}
