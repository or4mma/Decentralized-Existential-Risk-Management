import { Clarinet, Tx, type Chain, type Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts"
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts"

Clarinet.test({
  name: "Ensures that warning systems can be registered and warnings issued",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!
    
    // Register a new warning system
    let block = chain.mineBlock([
      Tx.contractCall(
          "cosmic-disaster-early-warning",
          "register-warning-system",
          [types.ascii("Gamma Ray Burst Detector"), types.ascii("Gamma Ray Burst"), types.ascii("L2 Orbit")],
          deployer.address,
      ),
    ])
    
    // Check that the system was registered successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Issue a warning
    block = chain.mineBlock([
      Tx.contractCall(
          "cosmic-disaster-early-warning",
          "issue-warning",
          [types.uint(1), types.ascii("Gamma Ray Burst"), types.uint(90), types.uint(30)],
          deployer.address,
      ),
    ])
    
    // Check that the warning was issued successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Calculate threat level
    block = chain.mineBlock([
      Tx.contractCall("cosmic-disaster-early-warning", "calculate-threat-level", [types.uint(1)], deployer.address),
    ])
    
    // Check threat level calculation
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u2700)")
  },
})

