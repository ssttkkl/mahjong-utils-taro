import { Improvement, Tile } from "mahjong-utils"
import { Text, View } from '@tarojs/components'
import { ViewProps } from "@tarojs/components/types/View"
import React from "react";
import { Column, Table } from "../Table"
import { Tiles } from "../Tiles"
import './index.scss'

export enum ActionShantenTableType {
  standard = 'standard',
  withGoodShapeInfo = 'withGoodShapeInfo',
  withGoodShapeImprovementInfo = 'withGoodShapeImprovementInfo'
}

export interface ActionShanten {
  action: Array<string | Tile> | string
  advance: Tile[]
  advanceNum: number
  goodShapeAdvance: Tile[] | null
  goodShapeAdvanceNum: number | null
  goodShapeRate: number | null
  goodShapeImprovement: Map<Tile, Improvement[]> | null,
  goodShapeImprovementNum: number | null
}

export interface ActionShantenTableProps extends ViewProps {
  title?: string;
  data: any[];
  type?: ActionShantenTableType
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
      <View style={{ flexDirection: 'column' }}>
        <Tiles tiles={advance} size={tilesSize} sorted style={{ display: 'block' }} />
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
    flex: 5
  },
  {
    title: '好型进张',
    key: 'goodShapeAdvance',
    dataIndex: 'goodShapeAdvance',
    flex: 4,
    render: (goodShapeAdvance: Tile[] | null, record: ActionShanten) => {
      if (goodShapeAdvance !== null) {
        const goodShapeRate = record.goodShapeRate !== null ? (record.goodShapeRate * 100).toFixed(2) + '%' : ''
        return (
          <View style={{ flexDirection: 'column' }}>
            <Tiles tiles={goodShapeAdvance} size={tilesSize} sorted style={{ display: 'block' }} />
            <Text>共{record.goodShapeAdvanceNum}张（{goodShapeRate}）</Text>
          </View>
        )
      } else {
        return null
      }
    }
  }
]

const columnsWithImprovementInfo = [
  {
    ...columns[0]
  },
  {
    ...columns[1],
    flex: 3
  },
  {
    title: '好型改良',
    key: 'goodShapeImprovement',
    dataIndex: 'goodShapeImprovement',
    flex: 6,
    render: (goodShapeImprovement: Map<Tile, Improvement[]> | null, record: ActionShanten) => {
      if (goodShapeImprovement !== null) {
        const impEntires = [...goodShapeImprovement.entries()].map(([k, v]) => ({
          tile: k,
          discard: v.map(x => x.discard),
          advanceNum: v[0].advanceNum
        }))
        impEntires.sort((a, b) => a.tile.compareTo(b.tile))

        return (
          <View style={{ flexDirection: 'column' }}>
            {impEntires.map((imp) => (
              <View className="imp-line">
                <Tiles size='small' tiles={[imp.tile]} />
                <Text>（打</Text>
                <Tiles size='tiny' tiles={imp.discard} />
                <Text>，听{imp.advanceNum}张）</Text>
              </View>
            ))}
            <Text>共{record.goodShapeImprovementNum}张</Text>
          </View>
        )
      } else {
        return null
      }
    }
  }
]

export const ActionShantenTable: React.FC<ActionShantenTableProps> = (props) => {
  let columns_: Column[]
  switch (props.type) {
    case ActionShantenTableType.withGoodShapeInfo:
      columns_ = columnsWithGoodShapeInfo
      break
    case ActionShantenTableType.withGoodShapeImprovementInfo:
      columns_ = columnsWithImprovementInfo
      break
    default:
      columns_ = columns
  }

  return (
    <Table columns={columns_} {...props} />
  )
}
