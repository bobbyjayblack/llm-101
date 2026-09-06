import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {lessons} from '../course.js';
import {runLab,labNarration} from '../labs.js';

const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
async function selectUnit(unit){
  const button=page.locator(`#unit-${unit}`);
  if(await button.getAttribute('aria-expanded')!=='true')await button.click();
  await page.locator(`#unit-lessons-${unit} button`).first().click();
}
try{
  await page.goto('http://127.0.0.1:4173');
  await page.locator('#unit-13').waitFor({state:'attached'});
  // This browser context is isolated from the learner's profile.
  await page.evaluate(()=>localStorage.setItem('ai-understood-v1',JSON.stringify({lesson:1,passage:2,notes:{1:'Existing learner note'},reviewed:{0:1},answers:{1:0},rate:'1.3',narrationSpeedVersion:2})));
  await page.reload();
  assert.equal(await page.locator('#title').textContent(),lessons[1].title);
  assert.equal(await page.locator('#notes').inputValue(),'Existing learner note');
  assert.match(await page.locator('#audio-status').textContent(),/passage 3/);
  assert.equal(await page.locator('.unit-toggle:visible').count(),13);
  await page.locator('#unit-3').click();
  assert.ok(await page.locator('#lesson').evaluate(el=>el.getBoundingClientRect().top>=document.querySelector(".app-header").getBoundingClientRect().bottom-1&&el.getBoundingClientRect().top<=parseFloat(getComputedStyle(el).scrollMarginTop)+24),'unit expansion scrolls to lesson top');
  assert.equal(await page.locator('#audio-status').evaluate(el=>el.previousElementSibling.id),'current-lesson');
  assert.equal(await page.locator('#current-lesson').evaluate(el=>el.previousElementSibling.id),'lesson-meta');
  assert.equal(await page.locator('#title').textContent(),lessons[1].title,'expansion does not replace the current lesson');
  assert.equal(await page.locator('.unit-toggle[aria-expanded=true]').count(),1);
  assert.equal(await page.locator('#unit-lessons-1').isVisible(),false);
  assert.equal(await page.locator('#unit-lessons-3 button:visible').count(),2);
  assert.equal(await page.locator('#unit-lessons-3').evaluate(el=>el.parentElement.nextElementSibling.querySelector('button').id),'unit-4');
  await page.locator('#unit-3').click();assert.equal(await page.locator('#unit-lessons-3').isVisible(),false);
  for(let i=0;i<lessons.length;i++){
    const lesson=lessons[i];
    if(await page.locator(`#unit-${lesson.unit}`).getAttribute('aria-expanded')!=='true')await page.locator(`#unit-${lesson.unit}`).click();
    await page.getByRole('button',{name:new RegExp(`^Lesson ${i+1}:`)}).click();
    assert.equal(await page.locator('#title').textContent(),lesson.title);
    assert.equal(await page.locator('.passage p').count(),lesson.paragraphs.length);
    await page.locator(`input[name=answer][value="${lesson.correct}"]`).check();
    await page.locator('#check').click();assert.equal(await page.locator('#feedback').textContent(),'Correct. '+lesson.explanation);
    assert.ok((await page.locator('#lesson-recall').textContent()).length>30);
    if(i===0||lessons[i-1].unit!==lesson.unit){
      for(const scenario of [0,1]){
        await page.locator('#lab-scenario').selectOption(String(scenario));await page.locator('#run-lab').click();
        assert.equal(await page.locator('#lab-result').textContent(),labNarration(runLab(lesson.unit,scenario)));
        assert.equal(await page.locator('#read-lab-result').isDisabled(),false);
      }
      await page.locator('#lab-solution summary').click();assert.ok(await page.locator('#lab-expected').isVisible());
    }
  }
  assert.ok(await page.locator('#next').isDisabled());
  await page.locator('#previous').click();assert.equal(await page.locator('#title').textContent(),lessons[28].title);
  await page.locator('#previous').click();assert.equal(await page.locator('#unit-12').getAttribute('aria-expanded'),'true');
  await page.locator('#next').click();assert.equal(await page.locator('#unit-13').getAttribute('aria-expanded'),'true');
  await page.locator('#lab-query').fill('How old is the moon?');await page.locator('#run-lab').click();
  assert.match(await page.locator('#lab-result').textContent(),/No supporting evidence/);
  await page.locator('#notes').fill('Capstone verification note');await page.locator('#complete').click();await page.reload();
  assert.equal(await page.locator('#notes').inputValue(),'Capstone verification note');assert.match(await page.locator('#complete').textContent(),/Reviewed/);
  await page.locator('#open-settings').click();await page.locator('#size').selectOption('36');await page.locator('#theme').selectOption('light');await page.locator('#close-settings').click();
  await mkdir('.service',{recursive:true});
  await page.locator('#unit-lab').scrollIntoViewIfNeeded();await page.screenshot({path:'.service/full-course-light.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#unit-1').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#unit-1').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Space');assert.equal(await page.locator('#unit-1').getAttribute('aria-expanded'),'false');
  await page.keyboard.press('Enter');await page.keyboard.press('Tab');
  assert.equal(await page.locator('#unit-lessons-1 button').first().evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Enter');
  assert.ok(await page.locator('#previous').isDisabled());
  await page.getByRole('button',{name:/^Lesson 2:/}).click();assert.equal(await page.locator('#notes').inputValue(),'Existing learner note');
  await page.locator('#open-settings').click();await page.locator('#size').selectOption('24');await page.locator('#theme').selectOption('dark');await page.locator('#close-settings').click();
  await selectUnit(5);await page.locator('#run-lab').click();await page.locator('#unit-lab').scrollIntoViewIfNeeded();
  await page.screenshot({path:'.service/full-course-dark.png'});
  await page.locator('#unit-5').scrollIntoViewIfNeeded();await page.screenshot({path:'.service/unit-navigation.png'});
  await page.locator('#toggle-sidebar').click();assert.equal(await page.locator('.unit-toggle:visible').count(),13);
  assert.equal(await page.locator('#audio-status').isVisible(),true);
  assert.equal(await page.locator('#current-lesson').isVisible(),true);
  await selectUnit(13);assert.equal(await page.locator('#title').textContent(),lessons[28].title);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#toggle-sidebar').click();
  await page.setViewportSize({width:480,height:900});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  console.log('30 lessons, 26 lab scenarios, quiz feedback, unit boundaries, keyboard selection, old/new notes, review persistence, 36px light/24px dark, and mobile overflow passed.');
}finally{await browser.close();}
