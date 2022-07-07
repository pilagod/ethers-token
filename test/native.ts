import { expect } from "chai"
import { ethers } from "hardhat"

import { Factory } from "@src/factory"

describe("Native", () => {
    const factory = Factory.use(ethers.provider)

    const ETHConfig = {
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        symbol: "ETH",
    }
    const ETH = factory.createNativeCtor(ETHConfig)

    describe("transfer", () => {
        it("should transfer from connected owner to recipient", async () => {
            const [vault] = await ethers.getSigners()
            const user = ethers.Wallet.createRandom()

            await ETH(10).from(vault).transfer(user)

            const balance = await ETH.balanceOf(user)
            expect(balance).to.equal(ETH(10))
        })
    })
})
