import { INVALID_ARGUMENT_WITH_CS } from './errors.js'
import { TX_TYPE_LIST } from './transaction.js'

export const SUBSCRIBEMessage = 'subscribe',
  UNSUBSCRIBEMessage = 'unsubscribe'

export const Block = 0,
  Transaction = 1,
  Subscription = 2,
  Listen = 3,
  MSG = 4

export const OK = 1,
  FAIL = 2

export default class Message {
  _is_web = false
  _type
  _addresses
  _signedAddresses
  _txTypes
  _data
  _state

  /**
   * @param {boolean} isWeb
   * @param {string|number} type
   * @param {Array<string>} addrs
   * @param {?Object} signedData
   * @param {?Array<string>} txTypes
   * @param {*} data
   */
  constructor({
    isWeb,
    type,
    addrs,
    signedData = null,
    txTypes = null,
    data = null,
  } = {}) {
    this._is_web = isWeb
    this._type = type
    if (addrs && Array.isArray(addrs)) this._addresses = addrs
    if (typeof signedData === 'object') this._signedAddresses = signedData
    if (txTypes && Array.isArray(txTypes)) this._txTypes = txTypes
    if (data) this._data = data
  }

  get IsWeb() {
    return this._is_web
  }

  get Type() {
    return this._type
  }

  get Addresses() {
    return this._addresses
  }

  get SignedAddresses() {
    return this._signedAddresses
  }

  get Data() {
    return this._data
  }

  get State() {
    return this._state
  }

  static FromJSON(value) {
    try {
      const msg = new Message(),
        parsed = JSON.parse(value)

      msg._type = parsed.type
      if (typeof parsed.addresses !== 'undefined')
        msg._addresses = parsed.addresses
      if (typeof parsed.signed_addresses !== 'undefined')
        msg._signedAddresses = parsed.signed_addresses
      if (typeof parsed.data !== 'undefined') msg._data = parsed.data
      if (typeof parsed.tx_types !== 'undefined') msg._txTypes = parsed.tx_types
      if (typeof parsed.state !== 'undefined') msg._state = parsed.state

      msg._validate()

      return { message: this, error: null }
    } catch (e) {
      return { message: null, error: e }
    }
  }

  static FromObject(obj) {
    try {
      const msg = new Message()

      msg._type = obj.type
      if (typeof obj.addresses !== 'undefined') msg._addresses = obj.addresses
      if (typeof obj.signed_addresses !== 'undefined')
        msg._signedAddresses = obj.signed_addresses
      if (typeof obj.data !== 'undefined') msg._data = obj.data
      if (typeof obj.tx_types !== 'undefined') msg._txTypes = obj.tx_types
      if (typeof obj.state !== 'undefined') msg._state = obj.state

      msg._validate()

      return { message: this, error: null }
    } catch (e) {
      return { message: null, error: e }
    }
  }

  ToJSON() {
    this._validate()

    return JSON.stringify({
      is_web: this._is_web,
      type: this._type,
      ...(this._addresses ? { addresses: this._addresses } : {}),
      ...(this._signedAddresses
        ? { signed_addresses: this._signedAddresses }
        : {}),
      ...(this._txTypes ? { tx_types: this._txTypes } : {}),
      ...(this._data ? { data: this._data } : {}),
    })
  }

  _validate() {
    if (
      typeof this._is_web !== 'undefined' &&
      typeof this._is_web !== 'boolean'
    ) {
      throw new Error(INVALID_ARGUMENT_WITH_CS('is_web'))
    }

    if (typeof this._type === 'undefined') {
      throw new Error(INVALID_ARGUMENT_WITH_CS('type'))
    } else {
      if (
        typeof this._type === 'string' &&
        ![SUBSCRIBEMessage, UNSUBSCRIBEMessage].includes(this._type)
      ) {
        throw new Error(INVALID_ARGUMENT_WITH_CS('type'))
      } else if (
        typeof this._type === 'number' &&
        ![Block, Transaction, Subscription, Listen, MSG].includes(this._type)
      ) {
        throw new Error(INVALID_ARGUMENT_WITH_CS('type'))
      }
    }

    if (
      typeof this._addresses !== 'undefined' &&
      !Array.isArray(this._addresses)
    ) {
      throw new Error(INVALID_ARGUMENT_WITH_CS('addresses'))
    }

    if (
      typeof this._signedAddresses !== 'undefined' &&
      typeof this._signedAddresses !== 'object'
    ) {
      throw new Error(INVALID_ARGUMENT_WITH_CS('signedAddresses'))
    }

    if (typeof this._txTypes !== 'undefined' && this._txTypes.length) {
      for (let i = 0; i < this._txTypes.length; i++) {
        if (!TX_TYPE_LIST.includes(this._txTypes[i])) {
          throw new Error(INVALID_ARGUMENT_WITH_CS('tx_types'))
        }
      }
    }

    if (
      typeof this._state !== 'undefined' &&
      ![OK, FAIL].includes(this._state)
    ) {
      throw new Error(INVALID_ARGUMENT_WITH_CS('state'))
    }
  }
}
