import { expect } from "chai"
import { Wallet } from "ethers"

import { getAddress } from "@src/address"

describe("Address", () => {
    const wallet = Wallet.createRandom()

    describe("getAddress", () => {
        it("should return target itself when target is string", async () => {
            const address = await getAddress(wallet.address)

            expect(address).to.equal(wallet.address)
        })

        it("should return address on target when target has address property", async () => {
            const address = await getAddress(wallet)

            expect(address).to.equal(wallet.address)
        })

        it("should return address by getAddress when target implements it", async () => {
            class Account {
                public constructor(private wallet: Wallet) {}

                public getAddress() {
                    return Promise.resolve(this.wallet.address)
                }
            }
            const account = new Account(wallet)

            const address = await getAddress(account)

            expect(address).to.equal(wallet.address)
        })
    })
})
