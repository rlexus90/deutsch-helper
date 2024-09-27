import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { IAntwort, Imsg, User } from '../types';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { NAMES, TEXT } from '../const';
import { v4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.wortDB;

export const saveWort = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  const wort = text.replace('/save', '').trim();
  console.log(wort);

  if (wort.length === 0)
    return {
      chatId: id,
      text: TEXT.ERROR,
    };

  try {
    save(wort);
    return { chatId: id, text: `${wort} added` };
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};

export const wordList = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  const getListCommand = new ScanCommand({
    TableName: dbName,
  });

  try {
    const list = await docClient.send(getListCommand);

    const worts = list.Items?.map((item) => item.wort);
    console.log(worts);

    return {
      chatId: id,
      text: worts?.join('\n') || TEXT.ERROR,
    };
  } catch (e) {
    console.log(e);
    return {
      chatId: id,
      text: TEXT.ERROR,
    };
  }
};

export const save = (wort: string) => {
  const addCommand = new PutCommand({
    TableName: dbName,
    Item: {
      id: v4(),
      wort,
    },
  });
  docClient.send(addCommand);
};
