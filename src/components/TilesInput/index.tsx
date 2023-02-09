import React, {CSSProperties, useState} from "react";
import {Text, View} from "@tarojs/components";
import {AtInput} from "taro-ui";
import {Tile} from "mahjong-utils";
import {AtInputProps} from "taro-ui/types/input";
import {Tiles} from "../Tiles";
import './index.scss'

export type TilesInputProps = AtInputProps & {
  rootViewClassname?: string
  rootViewStyle?: string | CSSProperties
}

export const TilesInput: React.FC<TilesInputProps> = ({rootViewStyle, rootViewClassname, ...props}) => {
  const {onChange} = props
  const [tiles, setTiles] = useState<Tile[]>([])

  const myOnChange = (v, e) => {
    const newTiles = Tile.parseTiles(v)
    if (newTiles !== undefined) {
      setTiles(newTiles)
    }
    if (onChange) {
      return onChange(v, e)
    }
  }

  return (
    <View className={rootViewClassname} style={rootViewStyle}>
      <AtInput {...props} onChange={myOnChange} />
      {tiles.length > 0 ?
        <View className='tiles-input__tiles_container'>
          <Tiles className='tiles-input__tiles' tiles={tiles} />
          <Text className='tiles-input__tiles_number'>{tiles.length}张</Text>
        </View>
        : null}
    </View>
  )
}
