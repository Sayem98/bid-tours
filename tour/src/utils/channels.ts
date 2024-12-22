import amqplib, { Channel } from "amqplib";

const MESSAGE_BROKER_URL = "amqp://rabbitmq";
const QUEUE_NAME = "tour_queue";

const create = async () => {
  if (!MESSAGE_BROKER_URL) {
    throw new Error("MESSAGE_BROKER_URL is not defined");
  }
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    return channel;
  } catch (err: any) {
    throw new Error(err);
  }
};

const publish = async (
  channel: Channel,
  bindingKey: string,
  message: string
) => {
  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
  } catch (err: any) {
    throw new Error(err);
  }
};

const subscribe = async (
  channel: Channel,
  callback: (message: string) => void,
  queue_name: string
) => {
  if (!QUEUE_NAME) {
    throw new Error("QUEUE_NAME is not defined");
  }

  channel.consume(queue_name, (message) => {
    if (!message) return;
    console.log("the message is:", message.content.toString());

    channel.ack(message);
  });
};

let _channel: Channel | null = null;
const channel = async () => {
  if (_channel) return _channel;
  _channel = await create();
  console.log("Channel created -2 ");
  return _channel;
};

channel();

export { create, publish, subscribe, channel };
