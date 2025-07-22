import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Duration, Stack } from "aws-cdk-lib";

export class AnalyticsFunction extends Construct {
  public readonly fn: lambda.Function;
  constructor(scope: Construct, id: string, table: dynamodb.Table) {
    super(scope, id);
    this.fn = new lambda.Function(this, "AnalyticsFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lib/lambda/analytics"),
      handler: "index.handler",
      timeout: Duration.seconds(5),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    this.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [table.tableArn],
      })
    );
  }
}
