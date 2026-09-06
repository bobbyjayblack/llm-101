import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,trainingStep,trainingResult} from './course.js';
test('worked example matches the learner-facing arithmetic',()=>{assert.equal(trainingStep(1),1.8);assert.equal(trainingResult(1).loss,8);assert.ok(Math.abs(trainingResult(1.8).loss-2.88)<1e-10);});
test('training reduces loss from both sides of the solution',()=>{for(const initial of [0,1,4,5]){let w=initial;for(let i=0;i<20;i++){const next=trainingStep(w);assert.ok(trainingResult(next).loss<trainingResult(w).loss);w=next;}assert.ok(Math.abs(w-3)<0.001);}assert.equal(trainingStep(3),3);});
test('every lesson has complete teaching and a valid assessment',()=>{assert.equal(lessons.length,6);for(const l of lessons){assert.ok(l.paragraphs.length>=5);assert.ok(l.options[l.correct]);for(const k of ['goal','explanation','prompt','rubric'])assert.ok(l[k]);}});
