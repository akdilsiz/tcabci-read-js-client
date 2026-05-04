import { Transaction } from './transaction'
import { Block } from './block'

export declare type SuccessCallback = (event: Event) => void
export declare type ErrorCallback = (event: Event) => void
export declare type CloseCallback = (event: Event) => void
export declare type ListenCallback = (
  block: Block | null,
  tx: Transaction | null,
  msg: any | null,
) => void
