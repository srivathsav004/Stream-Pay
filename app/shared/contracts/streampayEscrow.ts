export const STREAMPAY_ESCROW_ABI = [
  {
    type: 'function',
    name: 'deposit',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdraw',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getBalance',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getInfo',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'usdc', type: 'address' },
      { name: 'service', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
    ],
  },
] as const;
