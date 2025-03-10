import { Clarinet, Tx, type Chain, type Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts"
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts"

Clarinet.test({
  name: "Ensures that threat scenarios and response plans can be managed",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!
    
    // Register a new threat scenario
    let block = chain.mineBlock([
      Tx.contractCall(
          "existential-threat-response",
          "register-threat-scenario",
          [types.ascii("Global Pandemic"), types.ascii("Biological"), types.uint(85), types.uint(60)],
          deployer.address,
      ),
    ])
    
    // Check that the scenario was registered successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Create a response plan
    block = chain.mineBlock([
      Tx.contractCall(
          "existential-threat-response",
          "create-response-plan",
          [types.uint(1), types.ascii("Rapid Vaccine Development"), types.uint(75)],
          deployer.address,
      ),
    ])
    
    // Check that the plan was created successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Register a response team
    block = chain.mineBlock([
      Tx.contractCall(
          "existential-threat-response",
          "register-response-team",
          [types.ascii("Medical Research Coalition"), types.ascii("Vaccine development"), types.uint(85)],
          deployer.address,
      ),
    ])
    
    // Check that the team was registered successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Calculate threat risk
    block = chain.mineBlock([
      Tx.contractCall("existential-threat-response", "calculate-threat-risk", [types.uint(1)], deployer.address),
    ])
    
    // Check risk calculation
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u5100)")
  },
})

