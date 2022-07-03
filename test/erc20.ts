import { expect } from "chai"
import { Wallet } from "ethers"
import { ethers } from "hardhat"

import { ERC20 } from "@src/erc20"
import { ERC20Ctor, Factory } from "@src/factory"

class ERC20Mintable extends ERC20 {
    public static abi = [
        ...ERC20.abi,
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "_amount",
                    type: "uint256",
                },
            ],
            name: "mint",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
    ]

    public mint() {
        const { contract } = this.ctor<typeof ERC20>()
        return contract.connect(this.mustGetOwner()).mint(this)
    }
}

describe("ERC20", () => {
    const factory = Factory.use(ethers.provider)
    const user = Wallet.createRandom().connect(ethers.provider)

    let TKN: ERC20Ctor<typeof ERC20Mintable>

    beforeEach(async () => {
        const [operator] = await ethers.getSigners()
        // Setup balance for user to send tx
        await operator.sendTransaction({
            to: user.address,
            value: ethers.utils.parseEther("100"),
        })

        const TKNContract = await (
            await ethers.getContractFactory("ERC20Mintable", operator)
        ).deploy("Token", "TKN", 18)

        TKN = factory.createERC20Ctor(ERC20Mintable, {
            address: TKNContract.address,
            decimals: 18,
            symbol: "TKN",
        })
    })

    describe("allowance", () => {
        it("should approve allowance", async () => {
            const [spender] = await ethers.getSigners()

            await TKN(100).from(user).approve(spender)

            const allowance = await TKN.allowanceOf(user, spender)
            expect(allowance).to.equal(TKN(100))
        })

        it("should approve max allowance", async () => {
            const [spender] = await ethers.getSigners()

            await TKN.approveMax(user, spender)

            const allowance = await TKN.allowanceOf(user, spender)
            expect(allowance).to.equal(ethers.constants.MaxUint256)
        })
    })

    describe("transfer", () => {
        it("should transfer from owner to recipient", async () => {
            const [recipient] = await ethers.getSigners()

            await TKN(500).from(user).mint()
            await TKN(100).from(user).transfer(recipient)

            const balanceUser = await TKN.balanceOf(user)
            expect(balanceUser).to.equal(TKN(400))

            const balanceRecipient = await TKN.balanceOf(recipient)
            expect(balanceRecipient).to.equal(TKN(100))
        })

        it("should transfer by spender from owner to recipient", async () => {
            const [spender, recipient] = await ethers.getSigners()

            await TKN(500).from(user).mint()
            await TKN(300).from(user).approve(spender)
            await TKN(100).from(spender).transferFrom(user, recipient)

            const balanceUser = await TKN.balanceOf(user)
            expect(balanceUser).to.equal(TKN(400))

            const balanceRecipient = await TKN.balanceOf(recipient)
            expect(balanceRecipient).to.equal(TKN(100))

            const allowanceSpender = await TKN.allowanceOf(user, spender)
            expect(allowanceSpender).to.equal(TKN(200))
        })
    })
})
