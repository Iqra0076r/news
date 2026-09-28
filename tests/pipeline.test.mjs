import test from 'node:test';import assert from 'node:assert/strict';
import {normalize,similarity,parseFeed,validateDraft,safeFetch} from '../scripts/pipeline.mjs';
test('tracking URLs share identity',()=>assert.equal(normalize('https://example.com/a/?utm_source=x#x'),normalize('https://example.com/a/')));
test('different events are not exact duplicates',()=>{assert.equal(similarity('Lunar robot opens spacecraft door','Lunar robot opens spacecraft door'),1);assert.ok(similarity('Bank raises interest rates','Robot collects lunar samples')<.2);});
test('RSS full content and GUID survive parsing',()=>{const a=parseFeed('<rss><channel><item><title>Report</title><guid>x</guid><content:encoded><![CDATA[<p>Full facts</p>]]></content:encoded></item></channel></rss>');assert.equal(a[0].guid,'x');assert.match(a[0]['content:encoded'],/Full facts/);});
test('unsupported numbers block publication',()=>{const a={headline:'Scientists report a new finding in space',standfirst:'A new result.',body:'The study involved 999 samples. '.repeat(20)};assert.equal(validateDraft(a,{facts:['There were 12 samples']}),false);});
test('SSRF destinations fail before network',async()=>{await assert.rejects(safeFetch('http://127.0.0.1/admin',['www.nasa.gov']));await assert.rejects(safeFetch('https://evil.example/',['www.nasa.gov']));});
