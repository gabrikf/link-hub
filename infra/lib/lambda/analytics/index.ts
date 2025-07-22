import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";

const client = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");
    const {
      linkId,
      linkName,
      userAgent,
      ip,
      referrer,
      city,
      country,
      visitorId,
    } = body;

    if (!linkId) {
      return {
        statusCode: 400,
        body: "linkId is required",
      };
    }
    const timestamp = new Date().toISOString();
    await client.send(
      new PutItemCommand({
        TableName: "LinkClicks",
        Item: {
          id: { S: randomUUID() },
          linkId: { S: linkId },
          linkName: { S: linkName },
          timestamp: { S: timestamp },
          userAgent: { S: userAgent ?? "unknown" },
          ip: { S: ip ?? "unknown" },
          referrer: { S: referrer ?? "unknown" },
          city: { S: city ?? "unknown" },
          country: { S: country ?? "unknown" },
          visitorId: { S: visitorId ?? "unknown" },
        },
      })
    );
    return {
      statusCode: 201,
      body: "Analytics recorded successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
