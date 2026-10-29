# Deploy Your Own Contract

> Every code block is cited at a pinned commit; interfaces may move after it.

Deploy a contract on L1 with Remix, create its proxy on L2 in Remix's EEZ tab, and call it from L2. retrieve() on L1 returns the number you stored.

- Page: https://build.eez.io/dapp-developers/qs6-deploy-your-own-contract.html
- Source: `eez-core-protocol/src/base/EEZBase.sol:231 · _createCrossChainProxyInternal`
- Pinned at commit: `9a1f815`
- Verify: https://github.com/eez-association/eez-core-protocol/blob/9a1f815336c20d28e5ec5cecbf195c41fbd5ab0f/src/base/EEZBase.sol#L231

**What this proves:** On Ethereum mainnet, a call you made on the RollupX L2 changed a contract you deployed on L1: retrieve() on L1 returns the number you stored from L2.

**What it doesn't:** It doesn't show a revert unwinding both chains. Each step spends real ETH, and Remix's EEZ tab is an alpha, so its screens may change.

### Step 1 — DEPLOY ON L1. GIVE IT AN ADDRESS ON L2.

Storage lives on Ethereum. Create Proxy asks the L2 manager to deploy a stand-in for it with CREATE2, salted with your address and rollup ID 0, so Remix can show the address before it exists.

```solidity
// EEZBase.sol · Create Proxy calls
// createCrossChainProxy on EEZL2:
function _createCrossChainProxyInternal(
⋯
// paraphrasing :240: the salt is
// keccak256(originalRollupId, originalAddress)
proxy = address(new CrossChainProxy{salt: salt}());
// paraphrasing :242-243: then it records
// the proxy in authorizedProxies and emits
// CrossChainProxyCreated.

// originalAddress: your Storage on L1.
// originalRollupId: 0, the L1.
```

### Step 2 — CALL THE PROXY LIKE A LOCAL CONTRACT.

The proxy has no store(), so its fallback hands the call data and your address to EEZL2 as a cross-chain call. Remix's Preview needs debug calls the composer doesn't serve, so choose Send anyway.

```solidity
// CrossChainProxy.sol · store(123) matches
// nothing on the proxy, so fallback() calls:
function _fallback() internal {
⋯
} else {
  (success, result) =
  // paraphrasing :129: EEZ.call(
  //   executeCrossChainCall(msg.sender,
  //   msg.data)), forwarding msg.value
}
⋯

// On L2, EEZ is EEZL2. msg.sender is you;
// msg.data is store(123).
```

### Step 3 — IT LANDS ON L1.

On L1, EEZ runs your call through the proxy that stands for your L2 account, so Storage sees that proxy as msg.sender. Back on L1, retrieve() returns 123.

```solidity
// EEZ.sol · _processL2ToL1Calls: on L1, a
// call from L2 runs through its source's proxy.
// paraphrasing :1169: sourceProxy =
//   getOrCreateCrossChainProxy(
//   sourceAddress, sourceRollupId)
bytes memory payload = abi.encodeCall(
  // :1172 executeOnBehalf(target, gas, data)
);
⋯
// paraphrasing :1190:
//   sourceProxy.call{value}(payload)

// sourceAddress: you on L2.
// targetAddress: your Storage.
```

## Next

[Cross-Chain Flash Loan](qs7-cross-chain-flash-loan.md)

---

Whole site for agents: https://build.eez.io/llms.txt
