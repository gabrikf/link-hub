import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class LinkClickTable extends Construct {
  public readonly table: dynamodb.Table;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.table = new dynamodb.Table(this, "LinkClicks", {
      tableName: "LinkClicks",
      partitionKey: {
        name: "linkId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
}
