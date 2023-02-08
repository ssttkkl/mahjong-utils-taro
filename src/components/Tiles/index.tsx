import React from 'react'
import {Image} from '@tarojs/components'
import {type Tile} from 'mahjong-utils'
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
    <>
      {tiles_.map(x => {
        const text = x.toString()
        return <Image src={require(`../../assets/images/tiles/${text.toLowerCase()}.png`)}
          className={`tile-${props.size ?? 'normal'}`}
          ariaLabel={text}
          key={text}
          mode='aspectFit'
          imageMenuPrevent='true'
        />
      })}
    </>
  )
}

