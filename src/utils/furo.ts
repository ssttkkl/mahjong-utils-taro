import {Furo, FuroType, Tile} from "mahjong-utils";

export function furoToString(furo: Furo): string {
  switch (furo.type) {
    case FuroType.Chi:
      return `${furo.tile.num}${furo.tile.num + 1}${furo.tile.num + 2}${FuroType[furo.type]}`.toLowerCase()
    case FuroType.Pon:
      return `${furo.tile.num}${furo.tile.num}${furo.tile.num}${FuroType[furo.type]}`.toLowerCase()
    case FuroType.Minkan:
      return `${furo.tile.num}${furo.tile.num}${furo.tile.num}${furo.tile.num}${FuroType[furo.type]}`.toLowerCase()
    case FuroType.Ankan:
      return `0${furo.tile.num}${furo.tile.num}0${FuroType[furo.type]}`.toLowerCase()

  }
}

export function getFuroTiles(furo: Furo): Tile[] {
  switch (furo.type) {
    case FuroType.Chi:
      return [furo.tile, furo.tile.advance(1)!, furo.tile.advance(2)!]
    case FuroType.Pon:
      return [furo.tile, furo.tile, furo.tile]
    case FuroType.Minkan:
    case FuroType.Ankan:
      return [furo.tile, furo.tile, furo.tile, furo.tile]
  }
}
