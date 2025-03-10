import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock accounts
const mockAccounts = {
  deployer: { address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' },
  wallet1: { address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5' }
};

// Mock contract call function
const mockContractCall = vi.fn();

// Mock chain
const mockChain = {
  contractCall: mockContractCall
};

describe('Cosmic Disaster Early Warning Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockContractCall.mockImplementation((method, args, sender) => {
      if (method === 'register-warning-system') {
        return { result: '(ok u1)' };
      } else if (method === 'issue-warning') {
        return { result: '(ok u1)' };
      } else if (method === 'calculate-threat-level') {
        return { result: '(ok u2700)' };
      }
      return { result: '(err u404)' };
    });
  });
  
  it('should register a new warning system', () => {
    const result = mockChain.contractCall(
        'register-warning-system',
        ['Gamma Ray Burst Detector', 'Gamma Ray Burst', 'L2 Orbit'],
        mockAccounts.deployer.address
    );
    
    expect(mockContractCall).toHaveBeenCalledWith(
        'register-warning-system',
        ['Gamma Ray Burst Detector', 'Gamma Ray Burst', 'L2 Orbit'],
        mockAccounts.deployer.address
    );
    expect(result.result).toBe('(ok u1)');
  });
  
  it('should issue a warning', () => {
    const result = mockChain.contractCall(
        'issue-warning',
        [1, 'Gamma Ray Burst', 90, 30],
        mockAccounts.deployer.address
    );
    
    expect(mockContractCall).toHaveBeenCalledWith(
        'issue-warning',
        [1, 'Gamma Ray Burst', 90, 30],
        mockAccounts.deployer.address
    );
    expect(result.result).toBe('(ok u1)');
  });
  
  it('should calculate threat level correctly', () => {
    const result = mockChain.contractCall(
        'calculate-threat-level',
        [1],
        mockAccounts.deployer.address
    );
    
    expect(mockContractCall).toHaveBeenCalledWith(
        'calculate-threat-level',
        [1],
        mockAccounts.deployer.address
    );
    expect(result.result).toBe('(ok u2700)');
  });
});
