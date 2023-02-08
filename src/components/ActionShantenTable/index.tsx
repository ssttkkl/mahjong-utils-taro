import {Tile} from "mahjong-utils"
import {Text, View} from '@tarojs/components'
import {ViewProps} from "@tarojs/components/types/View"
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

export const ActionShantenTable: React.FC<ActionShantenTableProps> = (props) => {
  const tilesSize = "small"

  const columns: Column[] = [
    {
      title: '',
      key: 'action',
      dataIndex: 'action',
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
      render: (advance: Tile[], record: ActionShanten) => (
        <View style={{flexDirection: 'column'}}>
          <View style={{wordBreak: 'break-all'}}>
            <Tiles tiles={advance} size={tilesSize} sorted />
          </View>
          <Text>共{record.advanceNum}张</Text>
        </View>
      )
    },
    {
      title: '好型进张',
      key: 'goodShapeAdvance',
      dataIndex: 'goodShapeAdvance',
      render: (goodShapeAdvance: Tile[] | undefined, record: ActionShanten) => {
        if (goodShapeAdvance !== undefined) {
          return (
            <View style={{flexDirection: 'column'}}>
              <View style={{wordBreak: 'break-all'}}>
                <Tiles tiles={goodShapeAdvance} size={tilesSize} sorted />
              </View>
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
      render: (value: number | undefined) => value !== undefined ? (value * 100).toFixed(2) + '%' : ''
    }
  ]

  if (props.showGoodShapeInfo !== true) {
    columns.pop()
    columns.pop()

    columns[0].flex = 3
    columns[1].flex = 9
  } else {
    columns[0].flex = 3
    columns[1].flex = 4
    columns[2].flex = 3
    columns[3].flex = 2
  }

  return (
    <Table columns={columns} {...props} />
  )
}
