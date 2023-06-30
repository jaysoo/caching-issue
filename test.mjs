import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'node:child_process';

const template = `
import express from 'express';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

console.log('Started run %NUMBER%', Date.now());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});
app.listen(port, host, () => {
  console.log(\`[ ready ] http://\${host}:\${port}\`);
});
`;

for (let i=0; i<1000; i++) {
  console.log(`Iteration ${i}`);

  writeFileSync('src/main.ts', template.replace('%NUMBER%', i));
  execSync('npx nx run caching:build:development');

  const main = readFileSync('dist/caching/src/main.js', 'utf-8');

  if (!main.includes(`Started run ${i}`)) {
    console.log(`Failed at iteration ${i} with the following "src/main.ts":`);
    console.log(readFileSync('src/main.ts', 'utf-8'));

    console.log('------------------');

    console.log('The output is:')
    console.log(main);
    break;
  }
}

