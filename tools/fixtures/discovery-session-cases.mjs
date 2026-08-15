// Retained negative coverage for the discovery-session runtime verifier.
//
// These cases target the traceability rules that convert raw expert answers
// into cues, concerns, loss boundaries, decision patterns, and candidate
// Quality Intents. Passing this suite proves structural regression resistance
// only; it does not prove that the extracted expert knowledge is semantically
// correct.

const validator = "tools/validate-qif-runtime.mjs";

function topArrayCase(key) {
  return {
    id: `top-level-${key}-not-array`,
    rule: `top-level ${key} must be an array`,
    expect: `package ${key} must be an array.`,
    mutate: (pkg) => { pkg[key] = null; }
  };
}

function answer(pkg, id = "ANS-DS-001") {
  return pkg.rawExpertAnswers.find((entry) => entry.id === id);
}

function question(pkg, id = "QUE-DS-001") {
  return pkg.questionLogEntries.find((entry) => entry.id === id);
}

function extractionStep(pkg, id = "EXT-DS-001") {
  return pkg.extractionSteps.find((entry) => entry.id === id);
}

function session(pkg, id = "DSE-001") {
  return pkg.discoverySessions.find((entry) => entry.id === id);
}

export const cases = [
  topArrayCase("experts"),
  topArrayCase("cases"),
  topArrayCase("questionLogEntries"),
  topArrayCase("rawExpertAnswers"),
  topArrayCase("expertJudgments"),
  topArrayCase("cues"),
  topArrayCase("concerns"),
  topArrayCase("lossBoundaries"),
  topArrayCase("qualityIntents"),
  topArrayCase("qualityIntentDerivations"),
  topArrayCase("decisionPatterns"),
  topArrayCase("extractionSteps"),
  topArrayCase("discoverySessions"),
  {
    id: "question-missing-session",
    rule: "question log entry session resolves",
    expect: "references missing discovery session",
    mutate: (pkg) => { question(pkg).sessionRef = "DSE-NOPE-999"; }
  },
  {
    id: "question-missing-text",
    rule: "question log entry text required",
    expect: "QUE-DS-001 must include non-empty string questionText.",
    mutate: (pkg) => { question(pkg).questionText = ""; }
  },
  {
    id: "question-order-invalid",
    rule: "question log entry order positive integer",
    expect: "QUE-DS-001 order must be a positive integer.",
    mutate: (pkg) => { question(pkg).order = 0; }
  },
  {
    id: "raw-answer-question-different-session",
    rule: "raw answer question belongs to same session",
    expect: "ANS-DS-001 questionRef QUE-DS-004 belongs to a different discovery session.",
    mutate: (pkg) => { answer(pkg).questionRef = "QUE-DS-004"; }
  },
  {
    id: "raw-answer-question-different-case",
    rule: "raw answer question targets same case",
    expect: "ANS-DS-001 questionRef QUE-DS-004 targets a different case.",
    mutate: (pkg) => {
      answer(pkg).sessionRef = "DSE-002";
      answer(pkg).questionRef = "QUE-DS-004";
    }
  },
  {
    id: "raw-answer-ambiguity-not-array",
    rule: "raw answer ambiguity array",
    expect: "ANS-DS-001 must include ambiguity array.",
    mutate: (pkg) => { answer(pkg).ambiguity = "unclear"; }
  },
  {
    id: "raw-answer-missing-sensitive-handling",
    rule: "raw answer sensitive data handling required",
    expect: "ANS-DS-001 must include sensitiveDataHandling.",
    mutate: (pkg) => { delete answer(pkg).sensitiveDataHandling; }
  },
  {
    id: "cue-broken-concern-ref",
    rule: "cue concern resolves",
    expect: "CUE-DS-001 references missing concern",
    mutate: (pkg) => { pkg.cues[0].concernRef = "CON-NOPE-999"; }
  },
  {
    id: "concern-broken-loss-boundary-ref",
    rule: "concern loss boundary resolves",
    expect: "CON-DS-001 references missing loss boundary",
    mutate: (pkg) => { pkg.concerns[0].lossBoundaryRef = "LSB-NOPE-999"; }
  },
  {
    id: "quality-intent-broken-loss-boundary-ref",
    rule: "quality intent loss boundaries resolve",
    expect: "QIN-DS-001 references missing loss boundary",
    mutate: (pkg) => { pkg.qualityIntents[0].lossBoundaryRefs = ["LSB-NOPE-999"]; }
  },
  {
    id: "judgment-broken-cue-ref",
    rule: "expert judgment cue resolves",
    expect: "JDG-DS-001 references missing cue",
    mutate: (pkg) => { pkg.expertJudgments[0].cueRefs = ["CUE-NOPE-999"]; }
  },
  {
    id: "judgment-confidence-invalid",
    rule: "expert judgment confidence score",
    expect: "JDG-DS-001 confidence must be a number from 0 to 1.",
    mutate: (pkg) => { pkg.expertJudgments[0].confidence = 2; }
  },
  {
    id: "pattern-broken-source-judgment",
    rule: "decision pattern source judgments resolve",
    expect: "PAT-DS-001 references missing source judgment",
    mutate: (pkg) => { pkg.decisionPatterns[0].sourceJudgmentRefs = ["JDG-NOPE-999"]; }
  },
  {
    id: "derivation-without-pattern-or-boundary",
    rule: "quality intent derivation has source pattern or boundary",
    expect: "QID-DS-001 must reference at least one decision pattern or loss boundary.",
    mutate: (pkg) => {
      pkg.qualityIntentDerivations[0].sourceDecisionPatternRefs = [];
      pkg.qualityIntentDerivations[0].sourceLossBoundaryRefs = [];
    }
  },
  {
    id: "extraction-step-raw-answer-different-session",
    rule: "extraction step raw answers belong to same session",
    expect: "EXT-DS-001 raw expert answer ANS-DS-004 belongs to a different discovery session.",
    mutate: (pkg) => { extractionStep(pkg).rawExpertAnswerRefs = ["ANS-DS-004"]; }
  },
  {
    id: "extraction-step-no-output",
    rule: "extraction step must output derived entities",
    expect: "EXT-DS-001 must output at least one extracted or derived entity.",
    mutate: (pkg) => {
      const step = extractionStep(pkg);
      step.outputCueRefs = [];
      step.outputConcernRefs = [];
      step.outputLossBoundaryRefs = [];
      step.outputDecisionPatternRefs = [];
      step.outputQualityIntentDerivationRefs = [];
    }
  },
  {
    id: "extraction-step-ambiguity-not-array",
    rule: "extraction step ambiguity array",
    expect: "EXT-DS-001 must include ambiguity array.",
    mutate: (pkg) => { extractionStep(pkg).ambiguity = "unclear"; }
  },
  {
    id: "package-cue-not-justified-by-extraction-step",
    rule: "package cues justified by extraction steps",
    expect: "cue CUE-DS-001 is not justified by its extraction steps.",
    mutate: (pkg) => { extractionStep(pkg).outputCueRefs = []; }
  },
  {
    id: "session-question-belongs-to-other-session",
    rule: "session question refs belong to session",
    expect: "DSE-001 question log entry QUE-DS-004 belongs to a different discovery session.",
    mutate: (pkg) => { session(pkg).questionLogEntryRefs = ["QUE-DS-004"]; }
  },
  {
    id: "session-answer-belongs-to-other-session",
    rule: "session raw answer refs belong to session",
    expect: "DSE-001 raw expert answer ANS-DS-004 belongs to a different discovery session.",
    mutate: (pkg) => { session(pkg).rawExpertAnswerRefs = ["ANS-DS-004"]; }
  },
  {
    id: "session-cue-not-covered-by-session-step",
    rule: "session extracted cues covered by session extraction steps",
    expect: "DSE-001 cue CUE-DS-002 is not justified by its extraction steps.",
    mutate: (pkg) => { session(pkg).extractedCueRefs = ["CUE-DS-002"]; }
  }
];

export const spec = {
  suiteId: "discovery-session",
  basePackage: "examples/discovery-session-package.json",
  validator,
  corpusDir: "tests/fixtures/discovery-session",
  filePrefix: "discovery-session"
};
