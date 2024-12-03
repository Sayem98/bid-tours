import amqplib, { Channel } from "amqplib";

const MESSAGE_BROKER_URL = "amqp://localhost";
const EXCHANGE_NAME = "ONLINE_BOOKING";
const QUEUE_NAME = "auth_queue";

const create = async () => {
  if (!MESSAGE_BROKER_URL) {
    throw new Error("MESSAGE_BROKER_URL is not defined");
  }
  if (!EXCHANGE_NAME) {
    throw new Error("EXCHANGE_NAME is not defined");
  }
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: false });
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
    if (!EXCHANGE_NAME) {
      throw new Error("EXCHANGE_NAME is not defined");
    }
    channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message));
  } catch (err: any) {
    throw new Error(err);
  }
};

const subscribe = async (
  channel: Channel,
  //   callback: (message: string) => void,
  bindingKey: string
) => {
  if (!EXCHANGE_NAME) {
    throw new Error("EXCHANGE_NAME is not defined");
  }
  if (!QUEUE_NAME) {
    throw new Error("QUEUE_NAME is not defined");
  }
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, bindingKey);

  channel.consume(appQueue.queue, (message) => {
    if (!message) return;
    channel.ack(message);
  });
};

let _channel: Channel | null = null;
const channel = async () => {
  if (_channel) return _channel;
  _channel = await create();
  console.log("Channel created");
  return _channel;
};

export { create, publish, subscribe, channel };
