import * as express from 'express';

const app = express();

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.get('/', (_, res) => {
  res.send('hello!');
});

const port = process.env.PORT || 3001;
app.listen(port, (err: Error) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`App started at ${port}`);
});
