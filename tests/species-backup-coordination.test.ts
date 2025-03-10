import { Clarinet, Tx, type Chain, type Account, types } from "https://deno.land/x/clarinet@v1.0.0/index.ts"
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts"

Clarinet.test({
  name: "Ensures that species records and backups can be managed",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!
    
    // Register a new species
    let block = chain.mineBlock([
      Tx.contractCall(
          "species-backup-coordination",
          "register-species",
          [
            types.ascii("Panthera leo"),
            types.buff(Buffer.from("abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890", "hex")),
            types.ascii("Vulnerable"),
          ],
          deployer.address,
      ),
    ])
    
    // Check that the species was registered successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Register a backup location
    block = chain.mineBlock([
      Tx.contractCall(
          "species-backup-coordination",
          "register-backup-location",
          [types.ascii("Arctic Vault"), types.ascii("78.2332° N, 15.4946° E"), types.uint(95)],
          deployer.address,
      ),
    ])
    
    // Check that the location was registered successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok u1)")
    
    // Record a species backup
    block = chain.mineBlock([
      Tx.contractCall(
          "species-backup-coordination",
          "record-species-backup",
          [types.uint(1), types.uint(1), types.uint(500)],
          deployer.address,
      ),
    ])
    
    // Check that the backup was recorded successfully
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result, "(ok true)")
  },
})

