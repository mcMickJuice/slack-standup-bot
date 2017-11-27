import { ISlackRequest } from './handler';
import config from './config';
import { Request, Response } from 'express';

interface ISlackExpressRequest extends Request {
  body: ISlackRequest;
}

const verifySlackMiddleware = (
  req: ISlackExpressRequest,
  res: Response,
  next: () => void
) => {
  const { token } = req.body;

  if (token !== config.slackToken) {
    res
      .status(403)
      .send('Invalid Request. Is this from a configured slack app?');
    return;
  }

  next();
};

export default verifySlackMiddleware;
