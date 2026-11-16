// Validates the commit message. Git calls this script with the path of the
// message file as the first argument. Lines starting with "#" (git comments)
// are ignored.
const fs = require('fs');
const { MAX_LENGTH, findProblems } = require('./naming.cjs');

const file = process.argv[2];
const lines = fs
  .readFileSync(file, 'utf8')
  .split(/\r?\n/)
  .filter((line) => line.trim() !== '' && !line.startsWith('#'));

// Blocks AI attribution lines such as "Co-Authored-By: Claude ..." or
// "Generated with [Claude Code]".
const AI_WATERMARK = /co-authored-by:\s*claude|generated with \[?claude|noreply@anthropic\.com/i;

const errors = [];

lines.forEach((line, index) => {
  const label = index === 0 ? 'subject' : `line ${index + 1}`;
  if (line.length > MAX_LENGTH) {
    errors.push(`${label}: has ${line.length} characters (max ${MAX_LENGTH})`);
  }
  findProblems(line).forEach((problem) => errors.push(`${label}: ${problem}`));
  if (AI_WATERMARK.test(line)) {
    errors.push(`${label}: contains an AI attribution trailer (remove it)`);
  }
});

if (lines.length === 0) {
  errors.push('the commit message is empty');
}

if (errors.length > 0) {
  console.error('\n✖ Commit rejected. The message must be in English and at most 100 characters per line:');
  errors.forEach((e) => console.error(`  - ${e}`));
  console.error('');
  process.exit(1);
}
