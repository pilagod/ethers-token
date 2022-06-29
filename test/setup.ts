import { Snapshot } from "./utils/snapshot"

let snapshot: Snapshot

before(async () => {
    snapshot = await Snapshot.take()
})

beforeEach(async () => {
    await snapshot.reset()
})
