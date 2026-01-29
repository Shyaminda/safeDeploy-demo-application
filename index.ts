import express from 'express';

const app = express();
const port = 3000;

let count = 0;

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok - Application reached' });
});

app.get('/slow', async (_req, res) => {
  const delayMs = Number(3000);

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  res.status(200).json({
    status: 'slow',
    delayMs,
  });
});

app.get('/error', (_req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Intentional error for SafeDeploy demo',
  });
});

app.get('/sum', (_req, res) => {
  res.status(200).json({
    status: 'sum',
    sum: ++count,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export {app, count};
