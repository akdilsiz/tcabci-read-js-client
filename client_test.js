const tcAbciClient = require("./client")
const unitJS = require("unit.js")
const {INVALID_ARGUMENTS, INVALID_URL, TRANSACTION_TYPE_NOT_VALID, TRANSACTION_NOT_BROADCAST} = require("./errors")
const { TX_TYPE, READ_NODE_ADDRESS, READ_NODE_WS_ADDRESS} = require("./constants")
const {randomString} = require("./util")

describe("TCAbciClient TESTS", () => {

    it('should start with valid parameters and read node addresses',(done) => {
        const client = new tcAbciClient([READ_NODE_ADDRESS, READ_NODE_WS_ADDRESS])
        client.Start()
            .then(() => {
                const { connected, subscribed } = client.Status()
                unitJS.assert.equal(connected, true)
                unitJS.assert.equal(subscribed, false)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should start with valid parameters',(done) => {
        const client = new tcAbciClient()
        client.Start()
            .then(() => {
                const { connected, subscribed } = client.Status()
                unitJS.assert.equal(connected, true)
                unitJS.assert.equal(subscribed, false)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should reconnect with start and valid parameters',(done) => {
        const client = new tcAbciClient()
        client.Start()
            .then(() => {
                const { connected, subscribed } = client.Status()
                unitJS.assert.equal(connected, true)
                unitJS.assert.equal(subscribed, false)

                client.Disconnect(1003)
                setTimeout(() => {
                    const { connected: c2, subscribed: b2} = client.Status()
                    unitJS.assert.equal(c2, false)
                    unitJS.assert.equal(b2, false)

                    setTimeout(() => {
                        const { connected, subscribed } = client.Status()
                        unitJS.assert.equal(connected, true)
                        unitJS.assert.equal(subscribed, false)
                        done()
                    }, 3100)
                }, 1000)
            })
            .catch(err => {
                done(err)
            })
    })

    it('should subscribe with valid parameters',(done) => {
        const client = new tcAbciClient()
        client.Start()
            .then(() => {
                client.Subscribe(["2mSCzresfg8Gwu7LZ9k9BTWkQAcQEkvYHFUSCZE2ubM4QV89PTeSYwQDqBas3ykq2emHEK6VRvxdgoe1vrhBbQGN"])
                const { connected, subscribed } = client.Status()
                unitJS.assert.equal(connected, true)
                unitJS.assert.equal(subscribed, true)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should unsubscribe with valid parameters',(done) => {
        const client = new tcAbciClient()
        client.Start()
            .then(() => {
                client.Subscribe(["2mSCzresfg8Gwu7LZ9k9BTWkQAcQEkvYHFUSCZE2ubM4QV89PTeSYwQDqBas3ykq2emHEK6VRvxdgoe1vrhBbQGN"])
                const { connected, subscribed } = client.Status()
                unitJS.assert.equal(connected, true)
                unitJS.assert.equal(subscribed, true)
            })
            .then(() => {
                client.Unsubscribe()
                const { connected, subscribed } = client.Status()
                unitJS.assert.equal(connected, true)
                unitJS.assert.equal(subscribed, false)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should return last block',(done) => {
        const client = new tcAbciClient()
        client.LastBlock()
            .then(data => {
                unitJS.value(data.blocks).hasLength(1)
                unitJS.value(data.total_count).isGreaterThan(1)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should return transaction search result',(done) => {
        const client = new tcAbciClient()
        client.TxSearch({
                heightOperator: ">=",
                height: 0,
                recipientAddrs: ["2mSCzresfg8Gwu7LZ9k9BTWkQAcQEkvYHFUSCZE2ubM4QV89PTeSYwQDqBas3ykq2emHEK6VRvxdgoe1vrhBbQGN"],
                limit: 1,
                offset: 0,
                orderBy: "ASC"
            })
            .then(data => {
                unitJS.value(data.txs).hasLength(1)
                unitJS.assert.equal(data.total_count, 1)
                done()
            })
            .catch(err => {
                done(err)
            })
    })

    it('should not broadcast transaction if type is incorrect',(done) => {
        const client = new tcAbciClient()
        try {
            client.Broadcast({
                type: "dummy type",
                data: "",
                sender_addr: "",
                recipient_addr: ""
            })
        } catch (err) {
            unitJS.assert.equal(TRANSACTION_TYPE_NOT_VALID, err)
            done()
        }
    })

    it('should not broadcast transaction',(done) => {
        const client = new tcAbciClient()
        client.Broadcast({
            id: "dummy id",
            version: 0,
            type: TX_TYPE.TX_TYPE_ADDRESS,
            data: btoa(JSON.stringify({data: ""})),
            sender_addr: "2mSCzresfg8Gwu7LZ9k9BTWkQAcQEkvYHFUSCZE2ubM4QV89PTeSYwQDqBas3ykq2emHEK6VRvxdgoe1vrhBbQGN",
            recipient_addr: "2mSCzresfg8Gwu7LZ9k9BTWkQAcQEkvYHFUSCZE2ubM4QV89PTeSYwQDqBas3ykq2emHEK6VRvxdgoe1vrhBbQGN",
            sign: btoa("dummy sign"),
            fee: 0
        })
            .then(data => {
                unitJS.assert.notEqual(data.data.hash, "")
                done()
            })
            .catch(err => {
                unitJS.assert.equal(TRANSACTION_NOT_BROADCAST, err)
                done()
            })
    })

})