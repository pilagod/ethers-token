import { expect } from "chai"
import { ethers } from "hardhat"

import { ERC20 } from "@src/erc20"
import { Factory } from "@src/factory"
import { Native } from "@src/native"

describe("Factory", () => {
    const factory = Factory.use(ethers.provider)

    describe("Native", () => {
        const config = {
            address: "0x123",
            decimals: 10,
            symbol: "NTV",
        }

        it("should create native constructor with config", () => {
            const NTV = factory.createNativeCtor(config)

            expect(NTV.address).to.equal(config.address)
            expect(NTV.decimals).to.equal(config.decimals)
            expect(NTV.symbol).to.equal(config.symbol)
            expect(NTV.provider).to.equal(ethers.provider)

            const ntv = NTV(100)

            expect(ntv).to.be.instanceOf(NTV)
            expect(ntv).to.be.instanceOf(Native)
            expect(ntv).to.equal(
                ethers.utils.parseUnits("100", config.decimals),
            )
        })

        it("should create native custom constructor with config", () => {
            class NativeCustom extends Native {
                public greet() {
                    return "hello"
                }
            }
            const NTV = factory.createNativeCtor(NativeCustom, config)

            expect(NTV.address).to.equal(config.address)
            expect(NTV.decimals).to.equal(config.decimals)
            expect(NTV.symbol).to.equal(config.symbol)
            expect(NTV.provider).to.equal(ethers.provider)

            const ntv = NTV(100)

            expect(ntv).to.be.instanceOf(NTV)
            expect(ntv).to.be.instanceOf(Native)
            expect(ntv).to.be.instanceOf(NativeCustom)
            expect(ntv).to.equal(
                ethers.utils.parseUnits("100", config.decimals),
            )

            expect(ntv.greet()).to.equal("hello")
        })
    })

    describe("ERC20", () => {
        const config = {
            abi: [
                {
                    key: "value",
                },
            ],
            address: "0x123",
            decimals: 10,
            symbol: "TKN",
        }

        it("should create ERC20 constructor with config", () => {
            const TKN = factory.createERC20Ctor(config)

            expect(TKN.abi).to.equal(config.abi)
            expect(TKN.address).to.equal(config.address)
            expect(TKN.decimals).to.equal(config.decimals)
            expect(TKN.symbol).to.equal(config.symbol)
            expect(TKN.provider).to.equal(ethers.provider)

            const tkn = TKN(100)

            expect(tkn).to.be.instanceOf(TKN)
            expect(tkn).to.be.instanceOf(ERC20)
            expect(tkn).to.equal(
                ethers.utils.parseUnits("100", config.decimals),
            )
        })

        it("should create ERC20 custom constructor with config", () => {
            class ERC20Custom extends ERC20 {
                public greet() {
                    return "hello"
                }
            }
            const TKN = factory.createERC20Ctor(ERC20Custom, config)

            expect(TKN.abi).to.equal(config.abi)
            expect(TKN.address).to.equal(config.address)
            expect(TKN.decimals).to.equal(config.decimals)
            expect(TKN.symbol).to.equal(config.symbol)
            expect(TKN.provider).to.equal(ethers.provider)

            const tkn = TKN(100)

            expect(tkn).to.be.instanceOf(TKN)
            expect(tkn).to.be.instanceOf(ERC20)
            expect(tkn).to.be.instanceOf(ERC20Custom)
            expect(tkn).to.equal(
                ethers.utils.parseUnits("100", config.decimals),
            )

            expect(tkn.greet()).to.equal("hello")
        })
    })
})
