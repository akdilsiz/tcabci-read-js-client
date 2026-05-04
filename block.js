import { Transaction } from './transaction.js'

export class Block {
  _height
  _txs
  _hash
  _transactions
  _chainName
  _chainVersion

  get Height() {
    return this._height
  }

  get TXS() {
    return this._txs
  }

  get Hash() {
    return this._hash
  }

  get Transactions() {
    return this._transactions
  }

  get ChainName() {
    return this._chainName
  }

  get ChainVersion() {
    return this._chainVersion
  }

  /**
   * @param {string} value
   * @return {{block: ?Block, error: ?Error}}
   * @constructor
   */
  static FromJSON(value) {
    try {
      const bl = new Block(),
        parsed = JSON.parse(value)

      bl._transactions = []

      if (typeof parsed.height !== 'undefined') bl._height = parsed.height
      if (typeof parsed.txs !== 'undefined') bl._txs = parsed.txs
      if (typeof parsed.hash !== 'undefined') bl._hash = parsed.hash
      if (typeof parsed.chain_name !== 'undefined')
        bl._chainName = parsed.chain_name
      if (typeof parsed.chain_version !== 'undefined')
        bl._chainVersion = parsed.chain_version

      if (typeof parsed.transactions !== 'undefined') {
        for (let i = 0; i < parsed.transactions.length; i++) {
          const { transaction, error } = Transaction.FromObject(
            parsed.transactions[i],
          )
          if (error) {
            return { block: null, error: error }
          }

          bl._transactions.push(transaction)
        }
      }

      return { block: bl, error: null }
    } catch (e) {
      return { block: null, error: e }
    }
  }

  /**
   * @param {object} obj
   * @return {{block: ?Block, error: ?Error}}
   * @constructor
   */
  static FromObject(obj) {
    try {
      const bl = new Block()

      bl._transactions = []

      if (typeof obj.height !== 'undefined') bl._height = obj.height
      if (typeof obj.txs !== 'undefined') bl._txs = obj.txs
      if (typeof obj.hash !== 'undefined') bl._hash = obj.hash
      if (typeof obj.chain_name !== 'undefined') bl._chainName = obj.chain_name
      if (typeof obj.chain_version !== 'undefined')
        bl._chainVersion = obj.chain_version

      if (typeof obj.transactions !== 'undefined') {
        for (let i = 0; i < obj.transactions.length; i++) {
          const { transaction, error } = Transaction.FromObject(
            obj.transactions[i],
          )
          if (error) {
            return { block: null, error: error }
          }

          bl._transactions.push(transaction)
        }
      }

      return { block: bl, error: null }
    } catch (e) {
      return { block: null, error: e }
    }
  }
}
