import { spawn, spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const environment = { ...process.env, PORT: process.env.PORT ?? '8080' };

const serverBuild = spawnSync(process.execPath, ['server/build.mjs'], {
  env: environment,
  stdio: 'inherit',
});

if (serverBuild.status !== 0) {
  process.exit(serverBuild.status ?? 1);
}

const api = spawn(process.execPath, ['server/dist/index.mjs'], {
  env: environment,
  stdio: 'inherit',
});

const web = spawn(npmCommand, ['exec', '--', 'vite'], {
  env: process.env,
  stdio: 'inherit',
  shell: true,
});

const stop = () => {
  api.kill('SIGTERM');
  web.kill('SIGTERM');
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

api.on('exit', (code) => {
  if (code && code !== 0) {
    web.kill('SIGTERM');
    process.exit(code);
  }
});