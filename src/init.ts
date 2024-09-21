import { api } from './api/api';
import { botLambda } from './lambdas/bot-lambda';
import axios from 'axios';

import * as dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.TOKEN || '';

async function init() {
  console.log('\x1b[32m');
  botLambda();
  api();

  try {
    const resp = await axios.post(
      `https://api.telegram.org/bot${TOKEN}/setWebhook`,
      {
        url: 'https://txyxk4l4v6.execute-api.eu-west-2.amazonaws.com/prod/message',
      }
    );

    console.log(resp.data);
  } catch {
    console.log('Error');
  }
}

init();
