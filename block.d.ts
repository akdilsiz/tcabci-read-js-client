import { Transaction } from './transaction'

export declare class Block {
  get Height(): number
  get TXS(): number
  get Hash(): string|null
  get Transactions(): Transaction[]
  get ChainName(): string
  get ChainVersion(): string

  static FromJSON(value: string): { block?: Block, error?: Error }
  static FromObject(obj: Record<string, any>): { block?: Block, error?: Error }
}
