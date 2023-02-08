import {Text, View} from "@tarojs/components"
import {furoChanceShanten, ShantenWithFuroChance, ShantenWithoutGot, Tatsu, Tile} from "mahjong-utils"
import React, {useMemo} from "react"
import {useRouter} from "taro-hooks"
import {Card} from "../../../components/Card"
import {Tiles} from "../../../components/Tiles"
import {ActionShanten, ActionShantenTable} from "../../../components/ActionShantenTable"
import './index.scss'

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
}> = ({tiles, chanceTile, shantenInfo}) => {
  const {
    pass,
    chi,
    pon,
    minkan
  } = shantenInfo
  const grouped = new Map<number, Map<['pass'] | ['minkan'] | ['pon', Tile] | ['chi', Tatsu, Tile], ShantenWithoutGot>>()

  if (pass !== undefined) {
    if (!grouped.has(pass.shantenNum)) {
      grouped.set(pass.shantenNum, new Map())
    }
    grouped.get(pass.shantenNum)?.set(['pass'], pass)
  }

  if (minkan !== undefined) {
    if (!grouped.has(minkan.shantenNum)) {
      grouped.set(minkan.shantenNum, new Map())
    }
    grouped.get(minkan.shantenNum)?.set(['minkan'], minkan)
  }

  if (pon !== undefined) {
    pon.discardToAdvance.forEach((shantenAfterPonDiscard, discard) => {
      if (!grouped.has(shantenAfterPonDiscard.shantenNum)) {
        grouped.set(shantenAfterPonDiscard.shantenNum, new Map())
      }
      grouped.get(shantenAfterPonDiscard.shantenNum)?.set(['pon', discard], shantenAfterPonDiscard)
    })
  }

  chi.forEach(([tatsu, shantenAfterChi]) => {
    shantenAfterChi.discardToAdvance.forEach((shantenAfterChiDiscard, discard) => {
      if (!grouped.has(shantenAfterChiDiscard.shantenNum)) {
        grouped.set(shantenAfterChiDiscard.shantenNum, new Map())
      }
      grouped.get(shantenAfterChiDiscard.shantenNum)?.set(['chi', tatsu, discard], shantenAfterChiDiscard)
    })
  })

  const ordered = [...grouped.entries()]
  ordered.sort((a, b) => a[0] - b[0])

  return <>
    <Card title='手牌'
      style={{marginTop: '16px'}}
    >
      <View>
        <Tiles tiles={tiles} sorted />
      </View>
      <View>
        <Text>他家打</Text>
        <Tiles tiles={[chanceTile]} />
      </View>
    </Card>
    <Card title='向听数'
      style={{marginTop: '16px'}}
    >
      {getShantenText(shantenInfo.shantenNum)}
    </Card>
    {ordered.map(([shantenNum, infos]) => {
      let title = shantenNum === 0 ? '听牌打法' : `${shantenNum}向听打法`
      if (shantenNum !== shantenInfo.shantenNum) {
        title += '（退向）'
      }

      const curGroup = [...infos.entries()]
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
          goodShapeRate: shantenAfterAction.goodShapeAdvanceNum !== undefined
            ? shantenAfterAction.goodShapeAdvanceNum / shantenAfterAction.advanceNum
            : undefined
        }
      })

      return (
        <ActionShantenTable key={shantenNum}
          title={title}
          data={data}
          showGoodShapeInfo={shantenNum === 1}
          style={{'margin': '0 12px'}}
        />
      )
    })
    }
    <View style={{height: '16px'}} />
  </>
}

const FuroShantenResult: React.FC = () => {
  const [{params}] = useRouter()
  const tiles = params.tiles ? Tile.parseTiles(params.tiles) : undefined
  const chanceTile = params.chanceTile ? Tile.byText(params.chanceTile) : undefined
  const allowChi = params.allowChi === 'true'

  const result = useMemo(() => {
    if (tiles && chanceTile) {
      return furoChanceShanten(tiles, chanceTile, {allowChi})
    }
    return undefined
  }, [tiles, chanceTile, allowChi])

  if (result === undefined) {
    return <Text>计算中</Text>
  } else {
    return <ShantenWithFuroChanceView
      tiles={tiles!}
      chanceTile={chanceTile!}
      shantenInfo={result.shantenInfo}
    />
  }
}

export default FuroShantenResult
