# QIF Portable: Start Here

This package helps a human or AI use the Quality Intent Framework (QIF)
without cloning the full repository.

QIF asks a simple question:

> What must not go wrong, who could be harmed, and what evidence would justify
> a decision?

It is not a fixed checklist and it is not an autonomous agent.

## Five-Minute Setup

1. Keep this folder together. Do not upload only one file.
2. Give the folder or zip to your AI system as reference material.
3. Ask the AI to read `SYSTEM_INSTRUCTIONS.md` first.
4. Give it the target document, repository, product, process, or requirement.
5. Choose one of these requests:

```text
Evaluate this target using QIF. Show what must not fail, which evidence exists,
which evidence is missing, and why you reached the verdict.
```

```text
Define QIF quality checks for this requirement. Do not start from a generic
checklist. Derive checks from stakeholders, unacceptable losses, context, and
the evidence needed to make a decision.
```

## What Happens Next

```text
your target
   |
   v
what must not fail
   |
   v
quality intents and evidence
   |
   v
verdict, uncertainty, and next action
```

If this diagram is unclear, ask the AI to explain it using your actual target
before continuing.

## Read Order

For a normal review:

1. `SYSTEM_INSTRUCTIONS.md`
2. `QIF_CORE.md`
3. `USE_CASES.md`
4. `OUTPUT_TEMPLATE.json`

The `docs/`, `schemas/`, and `examples/` folders provide deeper guidance and
machine-readable package definitions. `MANIFEST.json` records the QIF version,
canonical source path, byte size, and SHA-256 digest of every included file.

## Important Boundary

Reading this package can guide an AI to act in QIF style. It does not by itself:

- execute QIF's repository verifiers;
- prove that cited evidence exists or is true;
- guarantee that an AI followed every instruction;
- grant authority to approve, release, operate, or accept risk;
- turn structural validity into semantic truth.

Use accountable human review, reproduction tests, operational feedback, and
governance for consequential decisions.

## 日本語で使う場合

AIに次のように伝えてください。

```text
最初に SYSTEM_INSTRUCTIONS.md を読み、以後はQIFの作法に従ってください。
固定チェックリストから始めず、対象者、起きてはいけない損失、必要な証拠を
特定してください。不明なことは推測で埋めず、質問または未解決事項として
示してください。回答は日本語で、専門用語には平易な説明を添えてください。
```
