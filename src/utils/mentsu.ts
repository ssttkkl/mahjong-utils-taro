import {Mentsu, MentsuType, Tile} from "mahjong-utils";

export function getMentsuTiles(mentsu: Mentsu): Tile[] {
  switch (mentsu.type) {
    case MentsuType.Kotsu:
      return [mentsu.tile, mentsu.tile, mentsu.tile]
    case MentsuType.Shuntsu:
      return [mentsu.tile, mentsu.tile.advance(1)!, mentsu.tile.advance(2)!]
  }
}
