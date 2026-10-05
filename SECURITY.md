# Security Policy

## Scope

The **core** of `@paladini/lattes-parser` is an offline XML toolkit: it reads and
writes files you provide and does not call the network (except optional Extrator).
Realistic concerns:

- Malicious XML or ZIP causing excessive memory/CPU use (zip bombs, huge text nodes).
- Path or encoding tricks that crash the parser instead of failing cleanly.
- Backup/restore writing to paths recorded in `manifest.json` — keep `.lattes-backup/`
  local and untrusted; do not restore manifests from untrusted sources.
- The optional **Extrator client** sending requests to a WSDL you configure (your
  institution's endpoint — not hardcoded by this package).
- Supply-chain issues in dependencies (`fast-xml-parser`, `fflate`, optional `soap`).
- The GitHub Actions release workflow leaking publish tokens.

We do **not** implement public Lattes scraping; report scraping bypasses elsewhere.

## Reporting a vulnerability

Please **do not open a public issue** for a suspected security problem. Email
**fnpaladini@gmail.com** with:

- Description and potential impact
- Steps to reproduce (minimal synthetic XML/ZIP is ideal)
- Severity assessment, if you have one

You should get an acknowledgment within a few days. We will coordinate disclosure
before any public write-up.

## Supported versions

Only the latest version on npm is supported. Security fixes ship in the next
patch/minor release — please upgrade before reporting issues that may already be
fixed.

## Data handling

Do not attach real Currículo Lattes files to security reports. Use redacted or
synthetic samples only (LGPD).
