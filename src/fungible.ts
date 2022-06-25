import { BigNumber, BigNumberish, ethers } from "ethers"

import { OwnerNotConnectedError } from "./error"
import { Owner } from "./types"

export type FungibleConfig = {
    owner?: Owner
    ignoreDecimals?: boolean
}

export class Fungible extends BigNumber {
    public static decimals = 18
    public static symbol = "FGBTKN"

    private owner?: Owner

    // @ts-ignore
    public constructor(value: BigNumberish, config: FungibleConfig = {}) {
        const self = Object.create(new.target.prototype) as Fungible

        const bn = ethers.utils.parseUnits(
            value.toString(),
            config.ignoreDecimals ? 0 : self.decimals,
        )
        Object.assign(self, bn)

        if (config.owner) {
            self.owner = config.owner
        }

        return self
    }

    public get decimals(): number {
        return this.ctor().decimals
    }

    public get symbol(): string {
        return this.ctor().symbol
    }

    /* big number */

    public add(value: BigNumberish): this {
        return this.wrap(super.add(value), { ignoreDecimals: true })
    }

    public sub(value: BigNumberish): this {
        return this.wrap(super.sub(value), { ignoreDecimals: true })
    }

    public mul(value: BigNumberish): this {
        return this.wrap(super.mul(value), { ignoreDecimals: true })
    }

    public div(value: BigNumberish): this {
        return this.wrap(super.div(value), { ignoreDecimals: true })
    }

    public abs(): this {
        return this.wrap(super.abs(), { ignoreDecimals: true })
    }

    /* util */

    public connect(owner: Owner) {
        return this.wrap(this, { owner })
    }

    public from(owner: Owner) {
        return this.connect(owner)
    }

    public getOwner(): Owner | undefined {
        return this.owner
    }

    public mustGetOwner(): Owner {
        const owner = this.getOwner()
        if (!owner) {
            throw new OwnerNotConnectedError("No owner connected to the token")
        }
        return owner
    }

    /* protected */

    protected ctor(): typeof this {
        return this.constructor as any
    }

    protected wrap(value: BigNumberish, config?: FungibleConfig): this {
        return Reflect.construct(this.constructor, [
            value,
            {
                owner: this.owner,
                ...(config || {}),
            },
        ])
    }
}
