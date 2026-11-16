// Validates the branches being pushed. Git sends lines on stdin with the format:
//   <local ref> <local sha> <remote ref> <remote sha>
// The branch name is checked (without the refs/heads/ prefix).
const fs = require('fs');
const { MAX_LENGTH, findProblems } = require('./naming.cjs');

const input = fs.readFileSync(0, 'utf8');
const errors = [];

input
  .split(/\r?\n/)
  .filter(Boolean)
  .forEach((line) => {
    const [, , remoteRef] = line.split(' ');
    // Skips branch deletions (local sha is all zeros).
    if (!remoteRef || !remoteRef.startsWith('refs/heads/')) return;
    const branch = remoteRef.replace('refs/heads/', '');
    if (branch.length > MAX_LENGTH) {
      errors.push(`branch "${branch}": has ${branch.length} characters (max ${MAX_LENGTH})`);
    }
    findProblems(branch).forEach((problem) => errors.push(`branch "${branch}": ${problem}`));
  });

if (errors.length > 0) {
  console.error('\n✖ Push rejected. Branch names must be in English and at most 100 characters:');
  errors.forEach((e) => console.error(`  - ${e}`));
  console.error('');
  process.exit(1);
}
