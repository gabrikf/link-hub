import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { LinkClickTable } from "./dynamo/link-table";
import { AnalyticsFunction } from "./lambda/analytics-function";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add("project", "link-hub");

    const linkClickTable = new LinkClickTable(this, "LinkClickTable");

    new AnalyticsFunction(this, "AnalyticsFunction", linkClickTable.table);
  }
}
