import React from 'react'
import { Image, View } from '@tarojs/components'
import { type Tile } from 'mahjong-utils'
import './index.css'

export interface TilesProps {
  tiles: Tile[]
  sorted?: boolean
  size?: 'large' | 'normal' | 'small'
}

export const Tiles: React.FC<TilesProps> = (props) => {
  let tiles_ = props.tiles
  if (props.sorted === true) {
    tiles_ = [...tiles_]
    tiles_.sort((a, b) => a.compareTo(b))
  }

  return (
    <View style={{wordBreak: 'break-all'}}>
      {tiles_.map(x => {
        const text = x.toString()
        return <Image src={require(`../../assets/images/tiles/${text.toLowerCase()}.png`)}
          className={`tile-${props.size ?? 'normal'}`}
          ariaLabel={text}
          mode="aspectFit"
          imageMenuPrevent="true" />
      })}
    </View>
  )
}

