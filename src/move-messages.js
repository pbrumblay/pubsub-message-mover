import {PubSub, v1} from '@google-cloud/pubsub';
import logger from '#utils/logger';

export async function moveMessages(options) {
  const subClient = new v1.SubscriberClient();
  const publishClient = new PubSub({projectId: options.topicproject});
  const publisher = publishClient.topic(options.targettopic, {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 100,
    },
  });

  // The low level API client requires a name only.
  const formattedSubscription = subClient.subscriptionPath(
    options.subproject,
    options.sourcesubscription,
  );

  // The maximum number of messages returned for this request.
  // Pub/Sub may return fewer than the number specified.
  const request = {
    subscription: formattedSubscription,
    maxMessages: options.nummessages,
  };

  let count = 0;
  /* eslint-disable no-await-in-loop */
  while (count < options.total) {
    // The subscriber pulls a specified number of messages.
    const [response] = await subClient.pull(request);

    // Process the messages.
    const ackIds = [];
    const publishPromises = [];
    if (!response.receivedMessages || response.receivedMessages.length === 0) {
      logger.warn(
        `No messages found on source subscription: ${request.subscription}`,
      );
      break;
    }

    for (const message of response.receivedMessages) {
      count++;
      logger.debug(`Received message: ${message.message.data}`);
      ackIds.push(message.ackId);
      publishPromises.push(
        publisher.publishMessage({data: message.message.data}),
      );
    }

    await Promise.all(publishPromises);

    if (ackIds.length > 0) {
      // Acknowledge all of the messages. You could also acknowledge
      // these individually, but this is more efficient.
      const ackRequest = {
        subscription: formattedSubscription,
        ackIds,
      };

      await subClient.acknowledge(ackRequest);
    }
  }
  /* eslint-enable no-await-in-loop */

  logger.info('Done.');
}
