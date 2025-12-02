import { avalancheFuji } from 'wagmi/chains';
import { FUJI_USDC_ADDRESS } from './erc20';

export const CHAIN = avalancheFuji;
export const USDC_ADDRESS = FUJI_USDC_ADDRESS;

// TODO: Set this to your deployed StreamPayEscrow address on Fuji
export const STREAMPAY_ESCROW_ADDRESS = '0xd2A6D88468507C180eDC482458f666ec298D39Aa';
