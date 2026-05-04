# Security Policy

## Supported versions

PaperTrail MCP is pre-1.0. The `main` branch and latest tagged release receive best-effort security fixes.

| Version | Supported |
| --- | --- |
| 0.x latest | Best effort |
| older 0.x | No |

## Reporting a vulnerability

Please do **not** report suspected vulnerabilities in public issues, pull requests, or discussions.

Use GitHub private vulnerability reporting when available. If it is not enabled, open a public issue asking for a private reporting path without including exploit details, secrets, personal data, or sensitive technical details.

## Scope

In scope:

- Bugs that cause PaperTrail MCP to read or write files outside explicit user-provided paths.
- CLI or MCP behavior that performs unexpected network, telemetry, or credential access.
- Unsafe dependency, CI, or release configuration shipped by this repository.

Out of scope:

- Vulnerabilities in unrelated MCP clients.
- Malicious fixture files supplied intentionally by a local user.
- General support requests or guaranteed maintenance timelines.

## Safety model

V1 is designed to be local-first and deterministic. Commands read local fixture/cache JSON and write only requested output files/directories. Hidden network calls, scraping, telemetry, and credential discovery are considered security regressions.
