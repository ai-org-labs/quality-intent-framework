const validator = "tools/validate-guided-elicitation.mjs";

function session(pkg) {
  return pkg.elicitationSessions[0];
}

function profile(pkg) {
  return pkg.userComprehensionProfiles[0];
}

function explanation(pkg) {
  return pkg.explanationUnits[0];
}

function strategy(pkg) {
  return pkg.questionStrategies[0];
}

function probe(pkg, index = 0) {
  return pkg.stepwiseProbes[index];
}

function scaffold(pkg) {
  return pkg.answerScaffolds[0];
}

function answer(pkg, index = 0) {
  return pkg.userAnswers[index];
}

function clarification(pkg) {
  return pkg.clarificationMoves[0];
}

function teachBack(pkg) {
  return pkg.teachBackChecks[0];
}

function state(pkg) {
  return pkg.elicitationStates[0];
}

function candidate(pkg, index = 0) {
  return pkg.derivedCandidates[index];
}

export const cases = [
  {
    id: "sessions-not-array",
    rule: "elicitationSessions must be an array",
    expect: "elicitationSessions must be an array.",
    mutate: (pkg) => { pkg.elicitationSessions = null; }
  },
  {
    id: "profile-missing-language",
    rule: "profile language required",
    expect: "UCP-001 must include non-empty string language.",
    mutate: (pkg) => { profile(pkg).language = ""; }
  },
  {
    id: "explanation-repeats-concept",
    rule: "plain-language explanation cannot repeat concept only",
    expect: "EXP-GE-001 plainLanguage must explain the concept, not repeat the concept label.",
    mutate: (pkg) => { explanation(pkg).plainLanguage = "Quality Intent"; }
  },
  {
    id: "strategy-not-anti-checklist",
    rule: "question strategy must be anti-checklist",
    expect: "QST-GE-001 antiChecklist must be true.",
    mutate: (pkg) => { strategy(pkg).antiChecklist = false; }
  },
  {
    id: "probe-broken-strategy-ref",
    rule: "probe strategy resolves",
    expect: "PRB-GE-001 references missing question strategy: QST-NOPE-999",
    mutate: (pkg) => { probe(pkg).strategyRef = "QST-NOPE-999"; }
  },
  {
    id: "probe-abstract-qif-question",
    rule: "probe avoids abstract QIF terminology",
    expect: "PRB-GE-001 questionText must not ask abstract QIF terminology without plain-language framing.",
    mutate: (pkg) => { probe(pkg).questionText = "What are the Quality Intents?"; }
  },
  {
    id: "scaffold-not-optional",
    rule: "answer scaffold is optional",
    expect: "SCF-GE-001 optional must be true.",
    mutate: (pkg) => { scaffold(pkg).optional = false; }
  },
  {
    id: "answer-probe-different-session",
    rule: "answer probe belongs to same session",
    expect: "ANS-GE-001 probeRef PRB-GE-001 belongs to a different elicitation session.",
    mutate: (pkg) => {
      pkg.elicitationSessions.push({
        id: "GES-OTHER",
        target: "Other target",
        purpose: "Other session",
        profileRef: "UCP-001",
        probeRefs: [],
        answerRefs: [],
        clarificationMoveRefs: [],
        teachBackCheckRefs: [],
        derivedCandidateRefs: [],
        stateRef: "EST-GE-001",
        status: "open"
      });
      probe(pkg).sessionRef = "GES-OTHER";
    }
  },
  {
    id: "clarification-resolved-without-result",
    rule: "resolved clarification cites resulting answer",
    expect: "CLR-GE-001 resolved clarification must cite resultingAnswerRefs.",
    mutate: (pkg) => { clarification(pkg).resultingAnswerRefs = []; }
  },
  {
    id: "teachback-broken-candidate-ref",
    rule: "teach-back candidate refs resolve",
    expect: "TBK-GE-001 references missing derived candidate: DCA-NOPE-999",
    mutate: (pkg) => { teachBack(pkg).derivedCandidateRefs = ["DCA-NOPE-999"]; }
  },
  {
    id: "state-known-facts-empty",
    rule: "state records known facts",
    expect: "EST-GE-001 knownFacts must include at least one fact.",
    mutate: (pkg) => { state(pkg).knownFacts = []; }
  },
  {
    id: "candidate-missing-source-answer",
    rule: "derived candidate cites raw answers",
    expect: "DCA-GE-001 must include at least one source answer.",
    mutate: (pkg) => { candidate(pkg).sourceAnswerRefs = []; }
  },
  {
    id: "candidate-finalized-without-teachback",
    rule: "finalized candidate requires accepted teach-back",
    expect: "DCA-GE-001 finalized candidate requires an accepted accurate teachBackCheck.",
    mutate: (pkg) => { candidate(pkg).teachBackCheckRefs = []; }
  },
  {
    id: "candidate-low-confidence-without-governance",
    rule: "low confidence requires governance",
    expect: "DCA-GE-001 low-confidence candidate requires governanceTriggerRefs.",
    mutate: (pkg) => { candidate(pkg).confidence = 0.4; }
  },
  {
    id: "session-answer-from-other-session",
    rule: "session answer refs belong to session",
    expect: "GES-001 answer ANS-GE-001 belongs to a different elicitation session.",
    mutate: (pkg) => { answer(pkg).sessionRef = "GES-OTHER"; }
  },
  {
    id: "governance-trigger-broken-session",
    rule: "governance trigger session resolves",
    expect: "GTR-GE-001 references missing elicitation session: GES-NOPE-999",
    mutate: (pkg) => {
      pkg.governanceTriggers = [{
        id: "GTR-GE-001",
        sourceSessionRef: "GES-NOPE-999",
        sourceDerivedCandidateRefs: ["DCA-GE-001"],
        triggerType: "low-confidence",
        reason: "Candidate confidence is too low.",
        severity: "medium",
        requiredAction: "Review candidate with accountable owner.",
        owner: "quality-owner",
        status: "open"
      }];
    }
  },
  {
    id: "boundary-claims-question-count-quality",
    rule: "verifier boundary rejects question count as quality",
    expect: "verifierBoundary must explicitly avoid treating question count as quality.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["semantic truth"]; }
  }
];

export const spec = {
  suiteId: "guided-elicitation",
  basePackage: "examples/guided-elicitation-package.json",
  validator,
  corpusDir: "tests/fixtures/guided-elicitation",
  filePrefix: "guided-elicitation"
};
