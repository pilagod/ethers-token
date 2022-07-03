import { expect } from "chai"
import { ethers } from "hardhat"

import { Factory } from "@src/factory"
import { Native } from "@src/native"

describe("Native", () => {
    const factory = Factory.use(ethers.provider)

    const ETHConfig = {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        symbol: "ETH",
    }
    const ETH = factory.createNativeCtor(ETHConfig)

    it("should be an instance of Native", () => {
        const e = ETH(0)

        expect(e).to.be.instanceOf(ETH)
        expect(e).to.be.instanceOf(Native)
    })

    it("should be able to access config on ctor", () => {
        expect(ETH.address).to.equal(ETHConfig.address)
        expect(ETH.decimals).to.equal(ETHConfig.decimals)
        expect(ETH.symbol).to.equal(ETHConfig.symbol)
        expect(ETH.provider).to.equal(ethers.provider)
    })

    describe("Blockchain Interaction", () => {
        describe("transfer", () => {
            it("should transfer from connected owner to recipient", async () => {
                const [vault] = await ethers.getSigners()
                const user = ethers.Wallet.createRandom()

                await ETH(10).from(vault).transferTo(user)

                const balance = await ETH.balanceOf(user)
                expect(balance).to.equal(ETH(10))
            })
        })
    })
})
