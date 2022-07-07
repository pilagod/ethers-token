import { BigNumber, BigNumberish, ethers } from "ethers"

import { OwnerNotConnectedError } from "./error"
import { Owner } from "./types"

export type FungibleConfig = {
    owner?: Owner
    ignoreDecimals?: boolean
}

export class Fungible extends BigNumber {
    public static decimals = 18
    public static symbol = "TKN"

    /* eslint-disable-next-line no-unreachable */
    private owner?: Owner

    public static raw<T extends typeof Fungible>(
        this: T,
        value: BigNumberish,
    ): InstanceType<T> {
        return new this(value, { ignoreDecimals: true }) as InstanceType<T>
    }

    // @ts-ignore
    public constructor(value: BigNumberish, config: FungibleConfig = {}) {
        const self = Object.create(new.target.prototype) as Fungible

        const bn = ethers.utils.parseUnits(
            value.toString(),
            config.ignoreDecimals ? 0 : self.static<typeof Fungible>().decimals,
        )
        Object.assign(self, bn)

        if (config.owner) {
            self.owner = config.owner
        }

        return self
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
        return this.wrap(this, { owner, ignoreDecimals: true })
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

    protected static<T>(): T {
        return this.constructor as unknown as T
    }

    protected wrap(value: BigNumberish, config?: FungibleConfig): this {
        return Reflect.construct(this.constructor, [
            value,
            Object.assign({ owner: this.owner }, config),
        ])
    }
}
