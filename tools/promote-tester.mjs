import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const repository = 'Yeseverk/server_110us-releases';
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== repository)
    throw new Error('Promotion must run in the distribution verification workflow.');
const tag = process.env.CANDIDATE_TAG;
const info = JSON.parse(fs.readFileSync('smoke/build-info.json', 'utf8').replace(/^\uFEFF/, ''));
const report = JSON.parse(fs.readFileSync('smoke/core-results.json', 'utf8').replace(/^\uFEFF/, ''));
if (tag !== `tester-v${info.version}` || !/^\d+\.\d+\.\d+$/.test(info.version) || !/^[a-f0-9]{40}$/.test(info.commit))
    throw new Error('Invalid verified version.');
if (!report.results.summary.tests || report.results.summary.failed || report.results.summary.skipped || report.results.summary.passed !== report.results.summary.tests)
    throw new Error('Incomplete or failed Windows test report.');

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' }).trim();
const release = JSON.parse(gh('release', 'view', tag, '--repo', repository, '--json', 'assets,isDraft'));
for (const name of [`AnotherSys.DFO110.Tester-${info.version}-full.nupkg`, 'AnotherSys.DFO110.Tester-win-Setup.exe', 'releases.win.json', 'SHA256SUMS.txt'])
    if (!release.assets.some(asset => asset.name === name && asset.size > 0)) throw new Error('Missing update asset: ' + name);
let current;
try {
    current = JSON.parse(gh('api', `repos/${repository}/contents/channels/tester.json?ref=main`));
} catch (error) {
    if (!String(error.stderr).includes('404')) throw error;
}
if (current) {
    const old = JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
    const compare = (a, b) => {
        for (let i = 0; i < 3; i++) { const difference = Number(a.split('.')[i]) - Number(b.split('.')[i]); if (difference) return difference; }
        return 0;
    };
    if (compare(info.version, old.version) < 0 || (info.version === old.version && info.commit !== old.commit))
        throw new Error('Refusing to downgrade or replace an existing version.');
}
gh('release', 'edit', tag, '--repo', repository, '--draft=false', '--prerelease', '--latest=false');
const manifest = { schema: 1, version: info.version, commit: info.commit,
    verifiedRun: `https://github.com/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`, publishedUtc: new Date().toISOString() };
const body = { message: `chore(release): 发布已验证测试版本 ${info.version}`, branch: 'main',
    content: Buffer.from(JSON.stringify(manifest, null, 2) + '\n').toString('base64'), ...(current ? { sha: current.sha } : {}) };
execFileSync('gh', ['api', '--method', 'PUT', `repos/${repository}/contents/channels/tester.json`, '--input', '-'],
    { input: JSON.stringify(body), encoding: 'utf8', stdio: ['pipe', 'ignore', 'inherit'] });
console.log('Tester channel promoted to ' + info.version);
