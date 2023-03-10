import {Tile} from "mahjong-utils"
import {Text, View} from '@tarojs/components'
import {ViewProps} from "@tarojs/components/types/View"
import React from "react";
import {Column, Table} from "../Table"
import {Tiles} from "../Tiles"


export interface ActionShanten {
  action: Array<string | Tile> | string
  advance: Tile[]
  advanceNum: number
  goodShapeAdvance?: Tile[]
  goodShapeAdvanceNum?: number
  goodShapeRate?: number
}

export interface ActionShantenTableProps extends ViewProps {
  title?: string;
  data: any[];
  showGoodShapeInfo?: boolean
}

const tilesSize = "small"

const columns: Column[] = [
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
    flex: 3,
    render: (action: Array<string | Tile> | string) => {
      if (action instanceof Array) {
        const children: React.ReactNode[] = []
        let pending: Tile[] = []
        action.forEach(value => {
          if (typeof value === 'string') {
            if (pending.length > 0) {
              children.push(<Tiles key={Tile.tilesToString(pending)} tiles={pending} size={tilesSize} sorted />)
              pending = []
            }
            children.push(<Text>{value}</Text>)
          } else {
            pending.push(value as Tile)
          }
        })
        if (pending.length > 0) {
          children.push(<Tiles key={Tile.tilesToString(pending)} tiles={pending} size={tilesSize} sorted />)
        }
        return <>{children}</>
      } else {
        return <Text>{action}</Text>
      }
    }
  },
  {
    title: '进张',
    key: 'advance',
    dataIndex: 'advance',
    flex: 9,
    render: (advance: Tile[], record: ActionShanten) => (
      <View style={{flexDirection: 'column'}}>
        <Tiles tiles={advance} size={tilesSize} sorted style={{display: 'block'}} />
        <Text>共{record.advanceNum}张</Text>
      </View>
    )
  }
]

const columnsWithGoodShapeInfo = [
  {
    ...columns[0]
  },
  {
    ...columns[1],
    flex: 4
  },
  {
    title: '好型进张',
    key: 'goodShapeAdvance',
    dataIndex: 'goodShapeAdvance',
    flex: 3,
    render: (goodShapeAdvance: Tile[] | undefined, record: ActionShanten) => {
      if (goodShapeAdvance !== undefined) {
        return (
          <View style={{flexDirection: 'column'}}>
            <Tiles tiles={goodShapeAdvance} size={tilesSize} sorted style={{display: 'block'}} />
            <Text>共{record.goodShapeAdvanceNum}张</Text>
          </View>
        )
      } else {
        return null
      }
    }
  },
  {
    title: '好型率',
    key: 'goodShapeRate',
    dataIndex: 'goodShapeRate',
    flex: 2,
    render: (value: number | undefined) => value !== undefined ? (value * 100).toFixed(2) + '%' : ''
  }
]

export const ActionShantenTable: React.FC<ActionShantenTableProps> = (props) => {
  const columns_ = props.showGoodShapeInfo !== true ? columns : columnsWithGoodShapeInfo

  return (
    <Table columns={columns_} {...props} />
  )
}
