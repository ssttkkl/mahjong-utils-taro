import {Text, View} from "@tarojs/components"
import {
  chitoiShanten,
  kokushiShanten,
  regularShanten,
  shanten,
  ShantenWithGot,
  ShantenWithoutGot,
  Tile
} from "mahjong-utils"
import React, {useMemo} from "react"
import {useRouter} from "taro-hooks"
import {Card} from "../../../components/Card"
import {Tiles} from "../../../components/Tiles"
import {ActionShanten, ActionShantenTable} from "../../../components/ActionShantenTable"
import './index.scss'
import {Panel} from "../../../components/Panel";

function getShantenText(shantenNum: number): string {
  switch (shantenNum) {
    case -1:
      return '和牌'
    case 0:
      return '听牌'
    default:
      return `${shantenNum}向听`
  }
}

const ShantenWithoutGotView: React.FC<{
  tiles: Tile[],
  shantenInfo: ShantenWithoutGot
}> = ({tiles, shantenInfo}) => {
  return <>
    <Card title='手牌'
      note='未摸牌'
      style={{marginTop: '16px'}}
    >
      <Tiles tiles={tiles} sorted />
    </Card>
    <Card title='向听数'
      style={{marginTop: '16px'}}
    >
      {getShantenText(shantenInfo.shantenNum)}
    </Card>
    <Card title='进张'
      note={`共${shantenInfo.advanceNum}张`}
      style={{marginTop: '16px'}}
    >
      <Tiles tiles={shantenInfo.advance} sorted />
    </Card>
    {shantenInfo.goodShapeAdvance !== undefined && shantenInfo.goodShapeAdvanceNum !== undefined
      ? <>
        <Card title='好型进张'
          note={`共${shantenInfo.goodShapeAdvanceNum}张`}
          style={{marginTop: '16px'}}
        >
          <Tiles tiles={shantenInfo.goodShapeAdvance} sorted />
        </Card>
        <Card title='好型率'
          style={{marginTop: '16px'}}
        >
          {(shantenInfo.goodShapeAdvanceNum / shantenInfo.advanceNum * 100).toFixed(2)}%
        </Card>
      </>
      : null}
    <View style={{height: '16px'}} />
  </>
}

const ShantenWithGotView: React.FC<{
  tiles: Tile[],
  shantenInfo: ShantenWithGot
}> = ({tiles, shantenInfo}) => {
  const orderedData = useMemo<[number, ActionShanten[]][]>(() => {
    const {
      discardToAdvance,
      ankanToAdvance
    } = shantenInfo
    const groupedShanten = new Map<number, Map<['discard' | 'ankan', Tile], ShantenWithoutGot>>()

    discardToAdvance.forEach((shantenAfterDiscard, discard) => {
      if (!groupedShanten.has(shantenAfterDiscard.shantenNum)) {
        groupedShanten.set(shantenAfterDiscard.shantenNum, new Map())
      }
      groupedShanten.get(shantenAfterDiscard.shantenNum)?.set(['discard', discard], shantenAfterDiscard)

      shantenAfterDiscard.advance.sort((a, b) => a.compareTo(b))
      if (shantenAfterDiscard.shantenNum === 1) {
        shantenAfterDiscard.goodShapeAdvance?.sort((a, b) => a.compareTo(b))
      }
    })

    ankanToAdvance.forEach((shantenAfterAnkan, ankan) => {
      if (!groupedShanten.has(shantenAfterAnkan.shantenNum)) {
        groupedShanten.set(shantenAfterAnkan.shantenNum, new Map())
      }
      groupedShanten.get(shantenAfterAnkan.shantenNum)?.set(['ankan', ankan], shantenAfterAnkan)

      shantenAfterAnkan.advance.sort((a, b) => a.compareTo(b))
      if (shantenAfterAnkan.shantenNum === 1) {
        shantenAfterAnkan.goodShapeAdvance?.sort((a, b) => a.compareTo(b))
      }
    })

    const orderedShantenGroups = [...groupedShanten.entries()]
    orderedShantenGroups.sort((a, b) => a[0] - b[0])

    return orderedShantenGroups.map(([shantenNum, group]) => {
      const curGroup = [...group.entries()]
      curGroup.sort((a, b) => {
        if (a[1].advanceNum !== b[1].advanceNum) {
          return a[1].advanceNum - b[1].advanceNum
        } else if (a[1].goodShapeAdvanceNum !== undefined && b[1].goodShapeAdvanceNum !== undefined) {
          return a[1].goodShapeAdvanceNum - b[1].goodShapeAdvanceNum
        } else {
          return 0
        }
      }).reverse()

      const data: ActionShanten[] = curGroup.map(([action, shantenAfterAction]) => {
        return {
          action: [action[0] === 'discard' ? '打' : '暗杠', action[1]],
          advance: shantenAfterAction.advance,
          advanceNum: shantenAfterAction.advanceNum,
          goodShapeAdvance: shantenAfterAction.goodShapeAdvance,
          goodShapeAdvanceNum: shantenAfterAction.goodShapeAdvanceNum,
          goodShapeRate: shantenAfterAction.goodShapeAdvanceNum !== undefined
            ? shantenAfterAction.goodShapeAdvanceNum / shantenAfterAction.advanceNum
            : undefined
        }
      })

      return [shantenNum, data]
    })
  }, [shantenInfo])

  return <>
    <Card title='手牌'
      note='已摸牌'
      style={{marginTop: '16px'}}
    >
      <Tiles tiles={tiles} sorted />
    </Card>
    <Card title='向听数'
      style={{marginTop: '16px'}}
    >
      {getShantenText(shantenInfo.shantenNum)}
    </Card>
    {orderedData.map(([shantenNum, data]) => {
      let title = shantenNum === 0 ? '听牌打法' : `${shantenNum}向听打法`
      if (shantenNum !== shantenInfo.shantenNum) {
        title += '（退向）'
      }

      return (
        <Panel title={title} key={shantenNum}>
          <ActionShantenTable
            data={data}
            showGoodShapeInfo={shantenNum === 1}
            style={{'margin': '0 12px'}}
          />
        </Panel>
      )
    })}
    <View style={{height: '16px'}} />
  </>
}

const ShantenResult: React.FC = () => {
  const [{params}] = useRouter()

  const result = useMemo<[Tile[], ShantenWithoutGot | ShantenWithGot] | undefined>(() => {
    const mode = params.mode ?? 'union'
    const tiles = params.tiles ? Tile.parseTiles(params.tiles) : undefined

    let func: (tiles: Tile[]) => { shantenInfo: ShantenWithoutGot | ShantenWithGot } = shanten

    switch (mode) {
      case 'union':
        func = shanten
        break;
      case 'regular':
        func = regularShanten
        break
      case 'chitoi':
        func = chitoiShanten
        break
      case 'kokushi':
        func = kokushiShanten
        break
    }
    if (tiles !== undefined) {
      const {shantenInfo} = func(tiles)
      console.log(`invoke ${mode} shanten`)
      return [tiles, shantenInfo]
    } else {
      return undefined
    }
  }, [params])

  if (result === undefined) {
    return <Text>计算中</Text>
  } else {
    const [tiles, shantenInfo] = result
    if (shantenInfo.type === "ShantenWithoutGot") {
      return <ShantenWithoutGotView tiles={tiles ?? []} shantenInfo={shantenInfo} />
    } else {
      return <ShantenWithGotView tiles={tiles ?? []} shantenInfo={shantenInfo} />
    }
  }
}

export default ShantenResult
