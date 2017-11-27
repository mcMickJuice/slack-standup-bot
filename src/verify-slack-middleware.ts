const verifySlackMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: () => void
) => {
  console.log('slack verify');

  next();
};

export default verifySlackMiddleware;
