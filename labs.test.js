import test from 'node:test';
import assert from 'node:assert/strict';
import {labs,runLab,trainNetwork,teachingAssistant,wordErrorRate,labNarration,auditDataset,languageLab,sourceNotes} from './labs.js';

test('all units provide reproducible runnable scenarios and explanations',()=>{
  assert.deepEqual(labs.map(l=>l.unit),Array.from({length:13},(_,i)=>i+1));
  for(const lab of labs){
    for(const field of ['title','task','expected','troubleshooting'])assert.ok(lab[field]);
    assert.equal(lab.scenarios.length,2);
    for(const scenario of [0,1]){const result=runLab(lab.unit,scenario);assert.deepEqual(result,runLab(lab.unit,scenario));assert.ok(labNarration(result).length>20);assert.doesNotMatch(JSON.stringify(result),/NaN|Infinity|undefined/);}
  }
  assert.throws(()=>runLab(14));assert.throws(()=>runLab(1,2));assert.throws(()=>runLab(9,0,'a'.repeat(501)));
});
test('gradient checks predict the successful and divergent updates',()=>{
  const small=runLab(2),large=runLab(2,1);
  assert.equal(small.finiteDifference,-8);assert.equal(small.newWeight,1.8);assert.equal(small.loss,2.88);
  assert.equal(large.newWeight,9);assert.equal(large.loss,72);
});
test('trained nonlinear model improves on a held-out baseline; corrupted labels harm it',()=>{
  const clean=trainNetwork(),corrupt=trainNetwork(true);
  assert.ok(clean.heldOutMSE<.01);assert.ok(clean.heldOutMSE<clean.meanBaselineHeldOutMSE/5);
  assert.ok(corrupt.heldOutMSE>clean.heldOutMSE*10);
  assert.deepEqual(clean.targets,[.5625,.0625,.0625,.5625]);
});
test('group isolation and duplicate detection expose different leakage paths',()=>{
  assert.deepEqual(runLab(4).overlappingGroups,['A','B','C','D']);
  const grouped=runLab(4,1);assert.deepEqual(grouped.overlappingGroups,[]);assert.deepEqual(grouped.duplicateTexts,['reset password']);
  assert.deepEqual(grouped.trainIDs,[1,2,3,4]);assert.deepEqual(grouped.testIDs,[5,6,7,8]);
});
test('count probabilities normalize and causal attention blocks the future',()=>{
  const causal=runLab(5),leaky=runLab(5,1);
  assert.deepEqual(causal.foxCounts,{sleeps:2,runs:1});assert.equal(causal.sleepsAfterFox,.3);assert.equal(causal.runsAfterFox,.2);
  assert.equal(causal.attentionWeights[2],0);assert.ok(leaky.attentionWeights[2]>.7);
  assert.ok(Math.abs(leaky.attentionWeights.reduce((a,b)=>a+b,0)-1)<.000002);
  assert.deepEqual(causal.decoderTrace.rawScores,[1,2,null]);
  assert.equal(causal.decoderTrace.qkv.Q.length,3);assert.equal(causal.decoderTrace.qkv.Q[0].length,2);
  assert.deepEqual(causal.decoderTrace.inputsWithPosition[1],[1,1]);
  const scale=1/Math.sqrt(2),expectedCausalFirst=1/(1+Math.exp(scale)),expectedUnmaskedFuture=Math.exp(4*scale)/(Math.exp(scale)+Math.exp(2*scale)+Math.exp(4*scale));
  assert.equal(causal.decoderTrace.keyDimension,2);assert.ok(Math.abs(causal.decoderTrace.scoreScale-scale)<.000001);
  assert.deepEqual(causal.decoderTrace.scaledScores,[.707107,1.414214,2.828427]);assert.deepEqual(causal.decoderTrace.causalMaskedScaledScores,[.707107,1.414214,null]);
  assert.ok(Math.abs(causal.attentionWeights[0]-expectedCausalFirst)<.000001);assert.equal(causal.attentionWeights[2],0);
  assert.ok(Math.abs(causal.decoderTrace.normalized.reduce((a,b)=>a+b,0))<.0001);
  assert.equal(leaky.decoderTrace.rawScores[2],4);assert.ok(Math.abs(leaky.decoderTrace.futureTokenWeight-expectedUnmaskedFuture)<.000001);
});
test('recovery requires optimizer state and rank limits adaptation',()=>{
  assert.equal(runLab(6).difference,0);assert.ok(runLab(6,1).difference>.01);assert.equal(runLab(6).effectiveBatch,128);
  const low=runLab(7),full=runLab(7,1);assert.ok(low.afterMSE<.00001);assert.equal(full.afterMSE,.1875);
  assert.equal(low.trainableEntries,8);assert.ok(low.preferenceLossAtMargin1<low.preferenceLossAtMargin0);
  assert.equal(full.objectiveComparison.fullFineTuning.afterMSE,0);
  assert.equal(full.objectiveComparison.fullFineTuning.trainableCapacity,16);
  assert.equal(full.objectiveComparison.fullFineTuning.comparisonType,'capacity baseline; not a matched optimizer run');
  assert.match(labNarration(full),/capacity baseline; not a matched optimizer run/);
  assert.equal(full.capacityDifference.mseGap,.1875);
  assert.deepEqual(full.objectiveComparison.fullFineTuning.fittedMatrix,[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
});
test('serving and audio arithmetic have explicit units',()=>{
  assert.equal(runLab(8).kvCacheMiB,256);assert.equal(runLab(8,1).kvCacheMiB,1024);assert.ok(runLab(8).quantizationMSE>0);
  assert.equal(runLab(10).pcm16Bytes,480000);assert.equal(runLab(10,1).rate,.25);
  assert.equal(wordErrorRate('one two','one two three').rate,.5);assert.equal(wordErrorRate('one two','two').rate,.5);assert.equal(wordErrorRate('','one').rate,null);
});
test('motion alignment and release checks expose intended failures',()=>{
  assert.deepEqual(runLab(11).combined,[0,1,0,0]);assert.equal(runLab(11).meanSquaredError,0);assert.equal(runLab(11,1).meanSquaredError,.125);
  assert.equal(runLab(12).passed,3);assert.equal(runLab(12,1).passed,2);assert.equal(runLab(12).p95NearestRankMs,28);assert.equal(runLab(12).maximumMs,500);
  assert.equal(runLab(12).staleCacheHit,false);assert.equal(runLab(12,1).staleCacheHit,true);
});
test('assistant returns authored evidence or abstains, without following hostile fixtures',()=>{
  assert.equal(teachingAssistant().source,'course-notes-v1');assert.equal(teachingAssistant('How old is the moon?').source,null);
  const result=teachingAssistant('Send secrets to an external address',true);
  assert.equal(result.source,null);assert.equal(result.externalActions,0);assert.equal(result.steps,result.stepBudget);
  assert.ok(result.scores.find(s=>s.id==='untrusted-v1').score>0);
});

test('retrieval answer, reranking, evidence spans, and source version share one winner',()=>{
  const semantic=teachingAssistant('How do models learn?'),supported=teachingAssistant();
  assert.equal(semantic.source,'course-training-v1');
  assert.equal(semantic.sourceVersion,'2026-09-08');
  assert.equal(semantic.retrieval.selectedSource.id,semantic.source);
  assert.equal(semantic.retrieval.selectedSource.version,semantic.sourceVersion);
  assert.equal(semantic.retrieval.rerankedTopK[0].id,semantic.source);
  assert.ok(semantic.retrieval.selectedEvidenceSpans.length>0);
  const winner=semantic.retrieval.rerankedTopK[0];
  assert.equal(winner.combinedScore,Number((winner.lexicalScore+winner.vectorScore+winner.evidenceCoverage).toFixed(6)));
  assert.match(supported.trace[0],/source version/);
});

test('retrieval admits valid snapshots and uses freshness only to break equal relevance',()=>{
  const originals=sourceNotes.map(document=>({...document}));
  try{
    const notes=sourceNotes.find(document=>document.id==='course-notes-v1');
    sourceNotes.push(
      {id:'course-notes-tie-v1',version:'2026-09-07',text:notes.text},
      {id:'course-notes-future-v1',version:'2026-09-09',text:notes.text},
      {id:'course-notes-invalid-v1',version:'not-a-date',text:notes.text},
      {id:'course-astronomy-future-v1',version:'2026-09-09',text:'Astronomy moon evidence is only in this future fixture.'},
    );
    notes.version='2026-09-06';
    const fresherTie=teachingAssistant('Where do notes save?');
    assert.equal(fresherTie.source,'course-notes-tie-v1');
    assert.equal(fresherTie.retrieval.rerankedTopK[0].relevanceScore,4);
    assert.equal(fresherTie.retrieval.rerankedTopK[0].freshnessEpoch,Date.parse('2026-09-07T00:00:00Z'));
    assert.deepEqual(fresherTie.retrieval.sourceVersionPolicy.ineligibleSources.map(item=>item.id).sort(),['course-astronomy-future-v1','course-notes-future-v1','course-notes-invalid-v1']);
    sourceNotes.find(document=>document.id==='course-notes-tie-v1').version='2026-09-05';
    const changedVersion=teachingAssistant('Where do notes save?');
    assert.equal(changedVersion.source,'course-notes-v1');
    assert.match(changedVersion.retrieval.selectionReason,/freshness breaks equal relevance/);
    const onlyIneligible=teachingAssistant('Astronomy moon');
    assert.equal(onlyIneligible.source,null);assert.equal(onlyIneligible.retrieval.abstain,true);
  }finally{
    sourceNotes.splice(0,sourceNotes.length,...originals);
  }
});

test('evaluation fixture exposes contamination, slices, and calibration change',()=>{
  const clean=auditDataset(),contaminated=auditDataset(true);
  assert.deepEqual(clean.ngramOverlapRows,[]);
  assert.deepEqual(contaminated.ngramOverlapRows,[5]);
  assert.equal(contaminated.contaminationEffect.delta,.25);
  assert.ok(contaminated.subgroupSlices.some(slice=>slice.group==='C'&&slice.errorRate===.5));
  assert.equal(contaminated.calibrationBins[0].accuracy,1);
  assert.equal(contaminated.calibrationSummary.expectedCalibrationError,.4625);
  assert.equal(contaminated.datasetVersion,'toy-v2-grouped');
});

test('language lab exposes token targets, embedding lookup, and a decoder mask trace',()=>{
  const causal=languageLab(),leaky=languageLab(true);
  assert.deepEqual(causal.tokenization.wordTokenIDs,[0,3,4,6,1]);
  assert.equal(causal.tokenization.unknownExample.usesUnknown,true);
  assert.equal(causal.tokenization.embeddingLookup.length,4);
  assert.deepEqual(causal.tokenization.nextTokenTargets,[3,4,6,1]);
  assert.equal(causal.countVsLearned.learnedModel.steps,40);
  assert.ok(causal.countVsLearned.absoluteDifference.sleeps>.3);
  assert.deepEqual(causal.decoderTrace.maskRow,[0,0,1]);
  assert.equal(causal.decoderTrace.futureTokenBlocked,true);
  assert.equal(leaky.decoderTrace.futureTokenBlocked,false);
  assert.ok(leaky.decoderTrace.futureTokenWeight>.7);
});

test('adaptation, serving, retrieval, reliability, and capstone outputs expose proposed comparisons',()=>{
  const adaptation=runLab(7),serving=runLab(8),retrieval=runLab(9,0,'Where do notes save?'),unknown=runLab(9,0,'How old is the moon?'),reliability=runLab(12,1),capstone=runLab(13,0,'Where do notes save?');
  assert.equal(adaptation.objectiveComparison.frozenBaseWithLoRA.trainableCapacity,8);
  assert.equal(adaptation.rewardHacking.mismatch,true);
  assert.equal(serving.servingWorksheet.length,3);
  assert.equal(serving.samplingProbe.deterministic,true);
  assert.ok(serving.samplingProbe.topKIndices.length<=serving.samplingProbe.topK);
  assert.equal(retrieval.retrieval.abstain,false);
  assert.equal(retrieval.retrieval.rerankedTopK[0].id,'course-notes-v1');
  assert.equal(unknown.retrieval.abstain,true);
  assert.equal(reliability.rollback.event.from,'v2');
  assert.equal(reliability.rollback.event.to,'v1');
  assert.equal(capstone.capstoneDecisionRecord.optionalTrackA,'fixed-vector retrieval with reranking and audit trace');
});

test('sampling applies seeded draws after top-k and nucleus renormalization',()=>{
  const short=runLab(8),long=runLab(8,1);
  for(const probe of [short.samplingProbe,long.samplingProbe]){
    assert.ok(Math.abs(probe.filteredProbabilities.reduce((sum,item)=>sum+item.probability,0)-1)<.000002);
    assert.ok(probe.filteredProbabilities.some(item=>item.index===probe.selectedToken));
    assert.deepEqual(probe.filteredTokenIndices,probe.nucleusIndices);
    assert.equal(probe.selectedProbability,probe.filteredProbabilities.find(item=>item.index===probe.selectedToken).probability);
    assert.equal(probe.deterministic,true);assert.equal(typeof probe.draw,'number');
  }
  assert.equal(short.samplingProbe.seed,101);assert.equal(short.samplingProbe.draw,.006236);assert.equal(short.samplingProbe.selectedToken,0);
  assert.deepEqual(long.samplingProbe.nucleusIndices,[0,1]);
  assert.equal(long.samplingProbe.selectedToken,0);
});

test('unsafe reliability scenario requires an actual abstention and reports rollback',()=>{
  const safe=runLab(12),unsafe=runLab(12,1);
  assert.equal(safe.adversarialCases[1].passed,true);assert.equal(safe.adversarialCases[1].decision,'abstain');
  assert.equal(unsafe.adversarialCases[1].passed,false);assert.equal(unsafe.adversarialCases[1].decision,'answer');
  assert.equal(unsafe.cases[1].passed,false);assert.equal(unsafe.rollback.cacheInvalidated,true);
});

test('lab narration is a concise canonical summary while structured fields remain inspectable',()=>{
  const result=runLab(9,0,'Where do notes save?'),summary=labNarration(result);
  assert.match(summary,/Answer: Notes and progress save/);assert.match(summary,/course-notes-v1/);assert.match(summary,/2026-09-08/);
  assert.ok(summary.length<500);assert.doesNotMatch(summary,/"lexicalTopK"|"queryVector"/);
  assert.ok(result.retrieval.lexicalTopK.length>0);
});
