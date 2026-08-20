const validator = "tools/validate-world-model-elicitation.mjs";

function session(pkg) {
  return pkg.worldModelElicitationSessions[0];
}

function rawIntent(pkg) {
  return pkg.rawIntents[0];
}

function hypothesis(pkg, index = 0) {
  return pkg.modelHypotheses[index];
}

function question(pkg) {
  return pkg.discriminatingQuestions[0];
}

function answer(pkg, index = 0) {
  return pkg.humanAnswers[index];
}

function elimination(pkg) {
  return pkg.hypothesisEliminations[0];
}

function sequence(pkg, index = 0) {
  return pkg.counterexampleSequences[index];
}

function expectation(pkg) {
  return pkg.sequenceExpectations[0];
}

function invariant(pkg) {
  return pkg.invariantCandidates[0];
}

function confirmation(pkg) {
  return pkg.invariantConfirmations[0];
}

function closure(pkg) {
  return pkg.elicitationClosureAssessments[0];
}

function worldModel(pkg) {
  return pkg.derivedWorldModels[0];
}

function scenario(pkg) {
  return pkg.acceptanceScenarios[0];
}

function qic(pkg) {
  return pkg.qualityIntentCandidates[0];
}

export const cases = [
  {
    id: "sessions-not-array",
    rule: "worldModelElicitationSessions must be an array",
    expect: "worldModelElicitationSessions must be an array.",
    mutate: (pkg) => { pkg.worldModelElicitationSessions = null; }
  },
  {
    id: "session-level-not-level-4",
    rule: "session level must be level-4",
    expect: "WME-SES-001 level must be level-4.",
    mutate: (pkg) => { session(pkg).level = "level-3"; }
  },
  {
    id: "session-needs-two-hypotheses",
    rule: "level-4 elicitation starts with competing hypotheses",
    expect: "WME-SES-001 must start with at least two modelHypothesisRefs.",
    mutate: (pkg) => { session(pkg).modelHypothesisRefs = ["HYP-WME-004"]; }
  },
  {
    id: "raw-intent-missing-statement",
    rule: "raw intent preserves original request",
    expect: "RIN-WME-001 must include non-empty string statement.",
    mutate: (pkg) => { rawIntent(pkg).statement = ""; }
  },
  {
    id: "hypothesis-source-raw-intent-required",
    rule: "hypothesis cites raw intent",
    expect: "HYP-WME-001 must include at least one source raw intent.",
    mutate: (pkg) => { hypothesis(pkg).sourceRawIntentRefs = []; }
  },
  {
    id: "question-compares-two-hypotheses",
    rule: "discriminating question compares hypotheses",
    expect: "DQU-WME-001 must compare at least two competing hypotheses.",
    mutate: (pkg) => { question(pkg).competingHypothesisRefs = ["HYP-WME-004"]; }
  },
  {
    id: "question-expected-answer-eliminates",
    rule: "expected answer branches eliminate hypotheses",
    expect: "DQU-WME-001 expectedAnswers must eliminate at least one hypothesis.",
    mutate: (pkg) => {
      for (const expected of question(pkg).expectedAnswers) expected.hypothesesEliminatedRefs = [];
    }
  },
  {
    id: "question-information-gain-score",
    rule: "question information gain is reproducible score",
    expect: "DQU-WME-001 informationGain must be a number from 0 to 1.",
    mutate: (pkg) => { question(pkg).informationGain = 1.5; }
  },
  {
    id: "answer-must-reference-prompt",
    rule: "human answer has elicitation source",
    expect: "HAN-WME-001 must reference a question, sequence, or invariant candidate.",
    mutate: (pkg) => {
      delete answer(pkg).questionRef;
      delete answer(pkg).sequenceRef;
      delete answer(pkg).invariantCandidateRef;
    }
  },
  {
    id: "elimination-leaves-remaining",
    rule: "hypothesis elimination cannot eliminate all models",
    expect: "HEL-WME-001 must include at least one remaining hypothesis.",
    mutate: (pkg) => { elimination(pkg).remainingHypothesisRefs = []; }
  },
  {
    id: "sequence-needs-two-steps",
    rule: "counterexample sequence exposes transition behavior",
    expect: "CEX-WME-001 steps must include at least two transitions.",
    mutate: (pkg) => { sequence(pkg).steps = ["up"]; }
  },
  {
    id: "sequence-exploration-type",
    rule: "counterexample sequence has known exploration type",
    expect: "CEX-WME-001 explorationType must be repeat, inverse, orthogonal, reference-frame, composition, or boundary.",
    mutate: (pkg) => { sequence(pkg).explorationType = "single-step"; }
  },
  {
    id: "expectation-sequence-ref-resolves",
    rule: "sequence expectation links sequence",
    expect: "SEQ-WME-001 references missing counterexample sequence: CEX-NOPE-999",
    mutate: (pkg) => { expectation(pkg).sequenceRef = "CEX-NOPE-999"; }
  },
  {
    id: "invariant-source-sequences-required",
    rule: "invariant derives from examples",
    expect: "INV-WME-001 must include at least one source sequence.",
    mutate: (pkg) => { invariant(pkg).sourceSequenceRefs = []; }
  },
  {
    id: "accepted-invariant-needs-confirmation",
    rule: "accepted invariant requires teach-back confirmation",
    expect: "INV-WME-001 accepted invariant requires an accepted accurate invariant confirmation.",
    mutate: (pkg) => { invariant(pkg).confirmationRefs = []; }
  },
  {
    id: "low-confidence-invariant-governance",
    rule: "low confidence invariant triggers governance",
    expect: "INV-WME-001 low-confidence invariant requires governanceTriggerRefs.",
    mutate: (pkg) => { invariant(pkg).confidence = 0.4; }
  },
  {
    id: "confirmation-answer-ref-resolves",
    rule: "invariant confirmation cites human answer",
    expect: "ICF-WME-001 references missing human answer: HAN-NOPE-999",
    mutate: (pkg) => { confirmation(pkg).answerRef = "HAN-NOPE-999"; }
  },
  {
    id: "world-model-selected-hypothesis-resolves",
    rule: "derived world model cites selected hypothesis",
    expect: "DWM-WME-001 references missing selected hypothesis: HYP-NOPE-999",
    mutate: (pkg) => { worldModel(pkg).selectedHypothesisRef = "HYP-NOPE-999"; }
  },
  {
    id: "acceptance-scenario-cites-world-model",
    rule: "acceptance scenario links derived model",
    expect: "ASC-WME-001 references missing derived world model: DWM-NOPE-999",
    mutate: (pkg) => { scenario(pkg).derivedWorldModelRef = "DWM-NOPE-999"; }
  },
  {
    id: "quality-intent-cites-acceptance-scenario",
    rule: "quality intent candidate derives from acceptance scenario",
    expect: "QIC-WME-001 must include at least one acceptance scenario.",
    mutate: (pkg) => { qic(pkg).acceptanceScenarioRefs = []; }
  },
  {
    id: "closed-closure-no-unresolved-hypotheses",
    rule: "closed elicitation has no unresolved hypotheses",
    expect: "CLO-WME-001 closed elicitation must have zero unresolvedHypothesisRefs.",
    mutate: (pkg) => { closure(pkg).unresolvedHypothesisRefs = ["HYP-WME-001"]; }
  },
  {
    id: "closed-closure-all-criteria-met",
    rule: "closed elicitation criteria are met",
    expect: "CLO-WME-001 closed elicitation requires all closureCriteria to be met.",
    mutate: (pkg) => { closure(pkg).closureCriteria[0].status = "unmet"; }
  },
  {
    id: "boundary-avoids-question-count-completeness",
    rule: "verifier boundary rejects question-count completeness",
    expect: "verifierBoundary must explicitly avoid requirement completeness by question count.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["semantic truth"]; }
  }
];

export const spec = {
  suiteId: "world-model-elicitation",
  basePackage: "examples/world-model-elicitation-package.json",
  validator,
  corpusDir: "tests/fixtures/world-model-elicitation",
  filePrefix: "world-model-elicitation"
};
