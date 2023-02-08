import React from 'react'
import {Image, View} from '@tarojs/components'
import {type Tile} from 'mahjong-utils'
import {ViewProps} from "@tarojs/components/types/View";
import './index.scss'

export interface TilesProps extends ViewProps {
  tiles: (Tile | undefined)[]
  sorted?: boolean
  size?: 'large' | 'normal' | 'small'
}

export const Tiles: React.FC<TilesProps> = (props) => {
  let tiles_ = props.tiles
  if (props.sorted === true) {
    tiles_ = [...tiles_]
    tiles_.sort((a, b) => {
      if (a && b) {
        return a.compareTo(b)
      } else if (a) {
        return 1
      } else if (b) {
        return -1
      } else {
        return 0
      }
    })
  }

  return (
    <View className='tiles' {...props}>
      {tiles_.map((x, index) => {
        const text = x?.toString().toLowerCase() ?? 'back'
        return <Image src={require(`../../assets/images/tiles/${text}.png`)}
          className={`tile-${props.size ?? 'normal'}`}
          ariaLabel={text}
          key={index}
          mode='aspectFit'
          imageMenuPrevent='true'
        />
      })}
    </View>
  )
}

