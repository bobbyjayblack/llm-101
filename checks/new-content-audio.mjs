import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
try{
  await page.goto('http://127.0.0.1:4173');
  await page.locator('#unit-select').selectOption('2');
  for(const control of ['#play','#read-lab-task']){
    const started=Date.now();await page.locator(control).click();
    await page.waitForFunction(()=>CSS.highlights.get('spoken-word')?.size>0,{},{timeout:240000});
    const word=await page.evaluate(()=>[...CSS.highlights.get('spoken-word')][0].toString());
    assert.ok(word.trim());
    await page.locator('#pause').click();assert.match(await page.locator('#audio-status').textContent(),/Paused/);
    await page.locator('#pause').click();await page.locator('#stop').click();
    assert.equal(await page.evaluate(()=>CSS.highlights.has('spoken-word')),false);
    console.log(`${control}: real local audio and word underlining reached in ${Date.now()-started} ms; pause/resume/stop passed.`);
  }
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
