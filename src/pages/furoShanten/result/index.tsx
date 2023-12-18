import { Text, View } from "@tarojs/components"
import {
  furoChanceShanten,
  ShantenWithFuroChance,
  ShantenWithoutGot,
  Tatsu,
  Tile
} from "mahjong-utils"
import React, { useMemo } from "react"
import { Card } from "../../../components/Card"
import { Tiles } from "../../../components/Tiles"
import { ActionShanten, ActionShantenTable, ActionShantenTableType } from "../../../components/ActionShantenTable"
import { Panel } from "../../../components/Panel";
import { buildSearchParams } from "../../../utils/searchParams";
import Result, { ResultProps } from "../../../components/Result"
import Page from "../../../components/Page"
import { ResultPageAd } from "../../../components/Ad/ResultPageAd"
import Spacer from "../../../components/Spacer"
import { useSharePage } from "../../../components/Share"

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

const ShantenWithFuroChanceView: React.FC<{
  tiles: Tile[],
  chanceTile: Tile,
  shantenInfo: ShantenWithFuroChance
}> = ({ tiles, chanceTile, shantenInfo }) => {
  const orderedData = useMemo<[number, ActionShanten[]][]>(() => {
    const {
      pass,
      chi,
      pon,
      minkan
    } = shantenInfo
    const groupedShanten = new Map<number, Map<['pass'] | ['minkan'] | ['pon', Tile] | ['chi', Tatsu, Tile], ShantenWithoutGot>>()

    if (pass !== null) {
      if (!groupedShanten.has(pass.shantenNum)) {
        groupedShanten.set(pass.shantenNum, new Map())
      }
      groupedShanten.get(pass.shantenNum)?.set(['pass'], pass)
    }

    if (minkan !== null) {
      if (!groupedShanten.has(minkan.shantenNum)) {
        groupedShanten.set(minkan.shantenNum, new Map())
      }
      groupedShanten.get(minkan.shantenNum)?.set(['minkan'], minkan)
    }

    if (pon !== null) {
      pon.discardToAdvance.forEach((shantenAfterPonDiscard, discard) => {
        if (!groupedShanten.has(shantenAfterPonDiscard.shantenNum)) {
          groupedShanten.set(shantenAfterPonDiscard.shantenNum, new Map())
        }
        groupedShanten.get(shantenAfterPonDiscard.shantenNum)?.set(['pon', discard], shantenAfterPonDiscard)
      })
    }

    chi.forEach(([tatsu, shantenAfterChi]) => {
      shantenAfterChi.discardToAdvance.forEach((shantenAfterChiDiscard, discard) => {
        if (!groupedShanten.has(shantenAfterChiDiscard.shantenNum)) {
          groupedShanten.set(shantenAfterChiDiscard.shantenNum, new Map())
        }
        groupedShanten.get(shantenAfterChiDiscard.shantenNum)?.set(['chi', tatsu, discard], shantenAfterChiDiscard)
      })
    })

    const orderedShantenGroups = [...groupedShanten.entries()]
    orderedShantenGroups.sort((a, b) => a[0] - b[0])

    return orderedShantenGroups.map(([shantenNum, group]) => {
      const curGroup = [...group.entries()]
      curGroup.sort((a, b) => {
        if (a[1].advanceNum !== b[1].advanceNum) {
          return a[1].advanceNum - b[1].advanceNum
        } else if (a[1].goodShapeAdvanceNum !== null && b[1].goodShapeAdvanceNum !== null) {
          return a[1].goodShapeAdvanceNum - b[1].goodShapeAdvanceNum
        } else {
          return 0
        }
      }).reverse()

      const data: ActionShanten[] = curGroup.map(([action, shantenAfterAction]) => {
        let actionText: Array<string | Tile> = []
        switch (action[0]) {
          case 'pass':
            actionText = ['PASS']
            break
          case 'chi':
            actionText = [action[1].first, action[1].second, '吃打', action[2]]
            break
          case 'pon':
            actionText = ['碰打', action[1]]
            break
          case 'minkan':
            actionText = ['大明杠']
            break
        }
        return {
          action: actionText,
          advance: shantenAfterAction.advance,
          advanceNum: shantenAfterAction.advanceNum,
          goodShapeAdvance: shantenAfterAction.goodShapeAdvance,
          goodShapeAdvanceNum: shantenAfterAction.goodShapeAdvanceNum,
          goodShapeRate: shantenAfterAction.goodShapeAdvanceNum !== null
            ? shantenAfterAction.goodShapeAdvanceNum / shantenAfterAction.advanceNum
            : null,
          goodShapeImprovement: shantenAfterAction.goodShapeImprovement,
          goodShapeImprovementNum: shantenAfterAction.goodShapeImprovementNum
        }
      })

      return [shantenNum, data]
    })
  }, [shantenInfo])


  return <>
    <Spacer size='16px' />

    <Card title='手牌'>
      <Tiles tiles={tiles} sorted />
      <View>
        <Text>他家打</Text>
        <Tiles tiles={[chanceTile]} />
      </View>
    </Card>

    <Spacer size='16px' />

    <Card title='向听数'>
      {getShantenText(shantenInfo.shantenNum)}
    </Card>

    <Spacer size='16px' />

    <ResultPageAd />

    <Spacer size='16px' />
    
    {orderedData.map(([shantenNum, data]) => {
      let title = shantenNum === 0 ? '听牌打法' : `${shantenNum}向听打法`
      if (shantenNum !== shantenInfo.shantenNum) {
        title += '（退向）'
      }

      let type = ActionShantenTableType.standard
      if (shantenNum === 1) {
        type = ActionShantenTableType.withGoodShapeInfo
      } else if (shantenNum === 0) {
        type = ActionShantenTableType.withGoodShapeImprovementInfo
      }

      return (
        <Panel title={title} key={shantenNum}>
          <ActionShantenTable
            data={data}
            type={type}
            style={{ 'margin': '0 12px' }}
          />
        </Panel>
      )
    })}

    <Spacer size='16px' />
  </>
}

const FuroShantenResult: React.FC = () => {
  useSharePage({title: '计算结果'});

  const calc: ResultProps['calc'] = (params) => {
    const tiles = params.tiles ? Tile.parseTiles(params.tiles) : undefined
    const chanceTile = params.chanceTile ? Tile.byText(params.chanceTile) : undefined
    const allowChi = params.allowChi === 'true'
    if (tiles && chanceTile) {
      console.log('invoke furoChanceShanten')
      const shantenResult = furoChanceShanten(tiles, chanceTile, { allowChi })
      console.log("result", shantenResult)
      return [tiles, chanceTile, shantenResult]
    } else {
      throw new Error("invalid params: " + buildSearchParams(params))
    }
  }

  return (
    <Page title='计算结果'>
      <Result
        calc={calc}
        render={(result) => {
          const [tiles, chanceTile, shantenResult] = result
          return <ShantenWithFuroChanceView
            tiles={tiles}
            chanceTile={chanceTile}
            shantenInfo={shantenResult.shantenInfo}
          />
        }}
      />
    </Page>
  )
}

export default FuroShantenResult
