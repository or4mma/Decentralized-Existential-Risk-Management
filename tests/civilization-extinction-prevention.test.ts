import { Clarinet, Tx, type Chain, type Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts"
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts"

Clarinet.test({
  name: "Ensures that extinction risks can be registered and updated",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!
    
    // Register a new extinction risk
    let block = chain.mineBlock([
      Tx.contractCall(
          "civilization-extinction-prevention",
          "register-extinction-risk",
          [types.ascii("Asteroid Impact"), types.uint(70), types.uint(95)],
          deployer.address,
      ),
    ])
    
    // Check that the risk was registered successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Get risk details
    block = chain.mineBlock([
      Tx.contractCall("civilization-extinction-prevention", "get-risk-details", [types.uint(1)], deployer.address),
    ])
    
    // Check risk details
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result.includes("Asteroid Impact"), true)
    
    // Calculate risk score
    block = chain.mineBlock([
      Tx.contractCall("civilization-extinction-prevention", "calculate-risk-score", [types.uint(1)], deployer.address),
    ])
    
    // Check risk score calculation
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u6650)")
  },
})

