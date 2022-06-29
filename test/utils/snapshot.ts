import { ethers } from "hardhat"

export class Snapshot {
    static async take(): Promise<Snapshot> {
        const snapshot = await ethers.provider.send("evm_snapshot", [])
        return new Snapshot(snapshot)
    }

    private constructor(public snapshot: string) {}

    public async reset() {
        // "evm_revert" will revert state to given snapshot then delete it, as well as any snapshots taken after.
        // (e.g.: reverting to id 0x1 will delete snapshots with ids 0x1, 0x2, etc.)
        await ethers.provider.send("evm_revert", [this.snapshot])
        // so we need to retake after each revert
        this.snapshot = await ethers.provider.send("evm_snapshot", [])
    }
}
