import {
  SendMessageBatchCommand,
  SendMessageCommand,
  SQSClient
} from '@aws-sdk/client-sqs'

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION ?? 'eu-west-2',
  endpoint: process.env.LOCALSTACK_URL ?? 'http://localhost:4566'
})

export function sendSqsMessage(
  queue,
  payload,
  title = 'cdp-portal-journey-tests'
) {
  if (Array.isArray(payload)) {
    const messages = payload.map((entry, index) => ({
      Id: `${title ?? new Date().getTime()}-${index}`,
      MessageBody: JSON.stringify(entry)
    }))

    const command = new SendMessageBatchCommand({
      QueueUrl: queue,
      Entries: messages
    })
    return sqsClient.send(command)
  } else {
    const message = {
      Id: `${title ?? new Date().getTime()}`,
      MessageBody: JSON.stringify(payload)
    }

    const command = new SendMessageCommand({
      QueueUrl: queue,
      MessageBody: message
    })
    return sqsClient.send(command)
  }
}
