import { TXType } from './transaction'

export declare type MessageType = string

export declare const SUBSCRIBEMessage: MessageType,
  UNSUBSCRIBEMessage: MessageType

export declare type MType =  number

export declare const Block: MessageType,
  Transaction: MessageType,
  Subscription: MessageType,
  Listen: MessageType,
  MSG: MessageType

export declare type MState = number

export declare const OK: MState,
  FAIL: MState

export declare class Message {
  constructor({
    isWeb,
    type,
    addrs,
    signedData,
    txTypes,
  }?: {
    isWeb: boolean
    type: MessageType
    addrs: string[]
    signedData?: Record<string, string>
    txTypes?: TXType[]
  })
  get IsWeb(): boolean
  get Type(): MessageType
  get Addresses(): string[] | null
  get SignedAddresses(): Record<string, string> | null
  get TXTypes(): TXType[] | null
  get Data(): any | null
  get State(): MState | null

  static FromJSON(value: string): { message?: Message; error?: Error }
  static FromObject(obj: Record<string, any>): { message?: Message; error?: Error }
  ToJSON(): string
}
