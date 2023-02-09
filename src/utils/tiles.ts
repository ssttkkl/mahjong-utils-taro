import { Tile } from "mahjong-utils";

export function validateNumOfTiles(tiles: Tile[]): boolean {
    const cnt: number[] = []
    for(const x of tiles) {
        cnt[x.code] = (cnt[x.code] ?? 0) + 1
        if (cnt[x.code] > 4) {
            return false
        }
    }
    return true
}