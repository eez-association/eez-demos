# EEZ Quickstarts

Short, step-by-step walkthroughs of how EEZ works, for dApp developers, rollup operators and protocol researchers. Each one pairs a diagram with real protocol code, cited at a pinned commit.

- **Site:** [build.eez.io](https://build.eez.io)
- **Live network:** [EEZ-X Testnet dashboard](https://eez.dev/dashboard/) (free) · [RollupX dashboard](https://rollupx.eez.dev/dashboard/) (a devnet on Ethereum mainnet; please start with small amounts)
- **For agents:** [`llms.txt`](llms.txt) · [`llms-full.txt`](llms-full.txt)

## Run locally

```bash
git clone https://github.com/eez-association/eez-demos.git
cd eez-demos && python3 -m http.server 8000
```

Static HTML, no build step. Pushing to `main` deploys the site.

## Contribute

```bash
bash scripts/audit.sh
python3 scripts/build-llms.py --check
```

Code is quoted verbatim and cited by `file:line`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the checklist.
