// assets/network-config.js — the source of truth for the hosted RollupX network values.
// deploy.html reads window.EEZ_NETWORK at render time and overwrites its
// [data-val] spans, but those spans also carry the same values as fallback
// text in the HTML. Change a value here AND in deploy.html's fallback text.
//
// Source: the RollupX Mainnet dashboard's own config, https://rollupx.eez.dev/dashboard/config.json,
// checked 2026-10-29 with eth_chainId on each RPC and front and eth_getCode on each manager
// (non-empty code on its own chain). Re-check both before changing a value.
window.EEZ_NETWORK = {
  status: "live", // "pending" | "live"
  dashboard: "https://rollupx.eez.dev/dashboard/",
  l2: {
    name: "RollupX Mainnet (L2)",
    rpcUrl: "https://rollupx.eez.dev/rpc/l2", // direct node RPC: reads and tooling
    // Composer front (config.json l2FrontUrl): send wallet transactions here.
    // Ordinary txs are forwarded unchanged, cross-chain ones are composed
    // (eez-rollupX README.md:136-142, testing/public-gateway/README.md:28-30).
    frontUrl: "https://rollupx.eez.dev/composer/l2",
    chainId: "696991", // eth_chainId 0xaa29f
    // EEZL2 proxy predeploy (config.json l2ContractAddress; also the genesis
    // profile value, eez-rollupX scripts/update-eezl2-genesis.sh:15).
    managerAddress: "0x4B2760F84B83d6b3829E30A7573B0172B6d6402C",
    explorer: "https://rollupx.eez.dev/explorer",
  },
  l1: {
    name: "Ethereum (L1)",
    rpcUrl: "https://rollupx.eez.dev/rpc/l1",
    frontUrl: "https://rollupx.eez.dev/composer/l1", // config.json l1FrontUrl
    chainId: "1", // eth_chainId 0x1
    managerAddress: "0x4b2760f84b83d6b3829e30a7573b0172b6d6402c", // EEZ (L1), config.json l1ContractAddress; rollupId 2; code present on Ethereum mainnet
    explorer: "https://etherscan.io",
  },
  // The protocol commit the network runs (config.json protocolCommit): 84a5b52 on the
  // unmerged feature/e2e_edge_cases branch (PR #54), 25 commits after the 9a1f815 the
  // walkthroughs cite. Between the two, only src/TODO.md changed under src/.
  deployedAt: "eez-core-protocol @ 84a5b52",
};
