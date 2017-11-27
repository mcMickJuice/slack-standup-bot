import * as express from 'express';
import * as bodyParser from 'body-parser';
import handler from './handler';

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.post('/standup', (req, res) => {
  const request = req.body;
  handler(request);

  res.send('acknowledged');
});

const port = process.env.PORT || 3001;
app.listen(port, (err: Error) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`App started at ${port}`);
});