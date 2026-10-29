// assets/network-config.js — the source of truth for the hosted network values.
// Two networks run the same protocol: a free testnet on Gnosis Chiado and a devnet
// on Ethereum mainnet. The reader picks one with the switch that assets/eez-network.js
// adds to every page; testnet is the default.
//
// deploy.html reads window.EEZ_NETWORK (the picked network) at render time and
// overwrites its [data-val] spans; those spans also carry the testnet values as
// fallback text, so change a value here AND in deploy.html's fallback text.
//
// Sources: each dashboard's own config, https://eez.dev/dashboard/config.json and
// https://rollupx.eez.dev/dashboard/config.json, checked 2026-10-29 with eth_chainId on
// each RPC and front and eth_getCode on each manager (non-empty code on its own chain).
// Re-check both before changing a value.
window.EEZ_NETWORKS = {
  testnet: {
    status: "live", // "pending" | "live"
    label: "Testnet",
    name: "EEZ-X Testnet",
    host: "eez.dev",
    dashboard: "https://eez.dev/dashboard/",
    account: "eez-testnet", // the cast wallet name the deploy commands use
    l2: {
      name: "EEZ-X Testnet (L2)",
      rpcUrl: "https://eez.dev/rpc/l2", // direct node RPC: reads and tooling
      // Composer front (config.json l2FrontUrl): send wallet transactions here.
      // Ordinary txs are forwarded unchanged, cross-chain ones are composed
      // (eez-rollupX README.md:136-142, testing/public-gateway/README.md:28-30).
      frontUrl: "https://eez.dev/composer/l2",
      chainId: "699169", // eth_chainId 0xaab21
      // EEZL2 proxy predeploy (config.json l2ContractAddress; also the genesis
      // profile value, eez-rollupX scripts/update-eezl2-genesis.sh:15).
      managerAddress: "0x4B2760F84B83d6b3829E30A7573B0172B6d6402C",
      explorer: "https://eez.dev/explorer",
    },
    l1: {
      name: "Gnosis Chiado (L1)",
      walletName: "Gnosis Chiado",
      rpcUrl: "https://eez.dev/rpc/l1",
      frontUrl: "https://eez.dev/composer/l1", // config.json l1FrontUrl
      chainId: "10200", // eth_chainId 0x27d8
      managerAddress: "0x6258189d3a04eb31a196a8931077dfe001a9f6fd", // EEZ (L1), config.json l1ContractAddress; rollupId 2
      explorer: "https://gnosis-chiado.blockscout.com",
    },
    deployedAt: "eez-core-protocol @ 84a5b52", // config.json protocolCommit
  },
  mainnet: {
    status: "live",
    label: "Mainnet",
    name: "RollupX Mainnet",
    host: "rollupx.eez.dev",
    dashboard: "https://rollupx.eez.dev/dashboard/",
    account: "eez-mainnet",
    l2: {
      name: "RollupX Mainnet (L2)",
      rpcUrl: "https://rollupx.eez.dev/rpc/l2",
      frontUrl: "https://rollupx.eez.dev/composer/l2",
      chainId: "696991", // eth_chainId 0xaa29f
      managerAddress: "0x4B2760F84B83d6b3829E30A7573B0172B6d6402C",
      explorer: "https://rollupx.eez.dev/explorer",
    },
    l1: {
      name: "Ethereum (L1)",
      walletName: "Ethereum Mainnet",
      rpcUrl: "https://rollupx.eez.dev/rpc/l1",
      frontUrl: "https://rollupx.eez.dev/composer/l1",
      chainId: "1", // eth_chainId 0x1
      managerAddress: "0x4b2760f84b83d6b3829e30a7573b0172b6d6402c", // EEZ (L1), config.json l1ContractAddress; rollupId 2; code present on Ethereum mainnet
      explorer: "https://etherscan.io",
    },
    // Both networks run 84a5b52, on the unmerged feature/e2e_edge_cases branch
    // (eez-core-protocol PR #54), 25 commits after the 9a1f815 the walkthroughs
    // cite. Between the two, only src/TODO.md changed under src/.
    deployedAt: "eez-core-protocol @ 84a5b52",
  },
};

// Pick the network: ?net=testnet|mainnet in the URL (so a shared link carries it),
// else the reader's last choice, else testnet. Only the two known names are accepted.
(function(){
  var KEY = "eez-network", pick = null;
  try { pick = new URLSearchParams(location.search).get("net"); } catch (e) {}
  if (pick !== "testnet" && pick !== "mainnet") {
    pick = null;
    try { pick = localStorage.getItem(KEY); } catch (e) {}
    if (pick !== "testnet" && pick !== "mainnet") pick = "testnet";
  } else {
    try { localStorage.setItem(KEY, pick); } catch (e) {}
  }
  window.EEZ_NET = pick;
  window.EEZ_NETWORK = window.EEZ_NETWORKS[pick];
})();
