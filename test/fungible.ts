import { expect } from "chai"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

import { OwnerNotConnectedError } from "@src/error"
import { Fungible } from "@src/fungible"

describe("Fungible", () => {
    class TKN extends Fungible {
        public static decimals = 10
        public static symbol = "TKN"
    }

    it("should be instance of BigNumber", () => {
        const t = new TKN(0)

        expect(t).to.be.instanceOf(BigNumber)
    })

    it("should translate decimals", () => {
        const t1 = new TKN(100)
        expect(t1).to.equal(ethers.utils.parseUnits("100", TKN.decimals))

        const t2 = new TKN(0.123)
        expect(t2).to.equal(ethers.utils.parseUnits("0.123", TKN.decimals))

        const t3 = new TKN(123.456)
        expect(t3).to.equal(ethers.utils.parseUnits("123.456", TKN.decimals))
    })

    it("should not translate decimals by raw", () => {
        const t = TKN.raw(100)

        expect(t).to.be.instanceOf(TKN)
        expect(t).to.equal(BigNumber.from(100))
    })

    it("should support arithmetic", () => {
        const t = new TKN(100)

        const add = t.add(new TKN(10))
        expect(add).to.be.instanceOf(TKN)
        expect(add).to.equal(new TKN(110))

        const sub = t.sub(new TKN(10))
        expect(sub).to.be.instanceOf(TKN)
        expect(sub).to.equal(new TKN(90))

        const mul = t.mul(10)
        expect(mul).to.be.instanceOf(TKN)
        expect(mul).to.equal(new TKN(1000))

        const div = t.div(10)
        expect(div).to.be.instanceOf(TKN)
        expect(div).to.equal(new TKN(10))

        const abs = t.mul(-1).abs()
        expect(abs).to.be.instanceOf(TKN)
        expect(abs).to.equal(new TKN(100))
    })

    it("should connect owner to token", async () => {
        const [user] = await ethers.getSigners()
        const t = new TKN(100)

        const tConnectUser = t.connect(user)
        expect(tConnectUser.getOwner()).to.equal(user)

        // `from` is an alias for `connect`
        const tFromUser = t.from(user)
        expect(tFromUser.getOwner()).to.equal(user)

        // `connect` / `from` will not affect original token instance
        expect(t.getOwner()).to.be.undefined
    })

    it("should throw error from mustGetOwner when no owner set", () => {
        const failToGetOwnerWhenOwnerNotSet = () => {
            new TKN(0).mustGetOwner()
        }
        expect(failToGetOwnerWhenOwnerNotSet).to.throw(OwnerNotConnectedError)
    })
})
