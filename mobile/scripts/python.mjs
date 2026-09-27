// Use the host's existing Python; do not install or change global tooling.
import { spawnSync } from 'node:child_process';

const candidates = process.env.PYTHON ? [process.env.PYTHON] :
  process.platform === 'win32' ? ['python', 'python3'] : ['python3', 'python'];
const python = candidates.find(command => {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8' });
  return result.status === 0 && /^Python 3\./.test(result.stdout + result.stderr);
});
if (!python) throw new Error('Python 3 is required. Set PYTHON to its executable path.');
const result = spawnSync(python, process.argv.slice(2), { stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
