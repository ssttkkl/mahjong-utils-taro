import {Text, View} from "@tarojs/components"
import {
  buildHora,
  Furo,
  FuroType,
  getChildPointByHanHu,
  getParentPointByHanHu,
  Hora,
  RegularHoraHandPattern,
  Tile,
  Wind
} from "mahjong-utils"
import React, {useMemo} from "react"
import {useRouter} from "taro-hooks"
import {ExtraYaku} from "mahjong-utils/dist/hora/yaku";
import {Tiles} from "../../../components/Tiles";
import {Card} from "../../../components/Card";
import {doubleTimesYakuman, yakuName} from "../../../utils/yaku";
import PointByHanHuResult from "../../pointByHanHu/result";
import {getMentsuTiles} from "../../../utils/mentsu";
import './index.scss'
import {getFuroTiles} from "../../../utils/furo";

const HoraView: React.FC<{
  tiles: Tile[],
  agari: Tile,
  hora: Hora
}> = ({tiles, agari, hora}) => {
  const sortedTiles = [...tiles]
  sortedTiles.splice(sortedTiles.findIndex(x => x === agari), 1)
  sortedTiles.sort((a, b) => a.compareTo(b))

  let timesOfYakuman = 0
  if (hora.hasYakuman) {
    hora.yaku.forEach(yk => {
      if (doubleTimesYakuman.find(x => x === yk) !== undefined) {
        timesOfYakuman += 2
      } else {
        timesOfYakuman += 1
      }
    })
  }

  const isParent = hora.pattern.selfWind === hora.pattern.roundWind
  let parent: { ron: number, tsumo: number } | undefined
  let child: { ron: number, tsumoParent: number, tsumoChild: number } | undefined

  if (isParent) {
    if (timesOfYakuman > 0) {
      parent = getParentPointByHanHu(13, 20)
      parent.ron *= timesOfYakuman
      parent.tsumo *= timesOfYakuman
    } else if (hora.han > 0) {
      parent = getParentPointByHanHu(hora.han, hora.pattern.hu)
    }
  } else {
    if (timesOfYakuman > 0) {
      child = getChildPointByHanHu(13, 20)
      child.ron *= timesOfYakuman
      child.tsumoParent *= timesOfYakuman
      child.tsumoChild *= timesOfYakuman
    } else if (hora.han > 0) {
      child = getChildPointByHanHu(hora.han, hora.pattern.hu)
    }
  }

  return <>
    <Card title='手牌'
      style={{marginTop: '16px'}}
    >
      <View>
        <Tiles tiles={sortedTiles} />
        <Tiles tiles={[agari]}
          style={{transform: 'rotate(90deg)'}}
        />
        {hora.pattern.type === 'RegularHoraHandPattern' ? (() => {
            const {furo} = hora.pattern as RegularHoraHandPattern

            return <>
              {furo.map(x => {
                let furoTiles: (Tile | undefined)[] = getFuroTiles(x)
                if (x.type === FuroType.Ankan) {
                  furoTiles = [undefined, furoTiles[1], furoTiles[2], undefined]
                }
                return <Tiles tiles={furoTiles}
                  key={`${x.type}-${x.tile.toString()}`}
                  style={{marginInlineStart: '8px'}}
                />
              })}
            </>
          })()
          : null}
      </View>
    </Card>
    {hora.pattern.type === 'RegularHoraHandPattern' ? (() => {
        const {jyantou, menzenMentsu, furo} = hora.pattern as RegularHoraHandPattern

        return <Card title='手牌拆解'
          style={{marginTop: '16px'}}
        >
          <View>
            雀头：<Tiles tiles={[jyantou, jyantou]} />
          </View>
          <View>
            面子：
            {menzenMentsu.map(mentsu => (
              <Tiles tiles={getMentsuTiles(mentsu)}
                key={`${mentsu.type}-${mentsu.tile.toString()}`}
                style={{marginInlineEnd: '8px'}}
              />
            ))}
          </View>
          {furo.length > 0 ?
            <View>
              副露：
              {furo.map(x => {
                let furoTiles: (Tile | undefined)[] = getFuroTiles(x)
                if (x.type === FuroType.Ankan) {
                  furoTiles = [undefined, furoTiles[1], furoTiles[2], undefined]
                }
                return <Tiles tiles={furoTiles}
                  key={`${x.type}-${x.tile.toString()}`}
                  style={{marginInlineEnd: '8px'}}
                />
              })}
            </View>
            : null}
        </Card>
      })()
      : null}
    <Card title='和牌分析'
      style={{marginTop: '16px'}}
    >
      <Text>
        番数：{hora.hasYakuman
        ? `${timesOfYakuman}倍役满`
        : (hora.han >= 13 ? `累计役满（${hora.han}番）` : `${hora.han}番`)}
        {'\n'}
        符数：{hora.pattern.hu}
        {'\n'}
        役种：{hora.yaku.map(x => yakuName[x]).join(', ')}
      </Text>
    </Card>
    <View style={{height: '16px'}} />
    <PointByHanHuResult parent={parent} child={child} />
  </>
}

const HoraResult: React.FC = () => {
  const [{params}] = useRouter()

  const result = useMemo<[Tile[], Tile, Hora] | undefined>(() => {
    try {
      const tiles = params.tiles ? Tile.parseTiles(params.tiles) : undefined
      const agari = params.agari ? Tile.byText(params.agari) : undefined
      const furo = (params.furo
        ?.split(',')
        ?.map(x => Furo.parse(x))
        ?.filter(x => x !== undefined) ?? []) as Furo[]
      const tsumo = params.tsumo === 'true'

      let dora = params.dora ? Number.parseInt(params.dora) : 0
      dora = Number.isNaN(dora) ? 0 : dora

      const selfWind = params.selfWind ? Wind[params.selfWind] : undefined
      const roundWind = params.roundWind ? Wind[params.roundWind] : undefined
      const extraYaku = params.extraYaku?.split(',').filter(x => x.length > 0) as ExtraYaku[]

      if (tiles !== undefined && agari !== undefined) {
        console.log("invoke buildHora")
        const hora = buildHora({tiles, agari, furo, tsumo, dora, selfWind, roundWind, extraYaku})
        return [tiles, agari, hora]
      } else {
        return undefined
      }
    } catch (e) {
      console.error(e)
      return undefined
    }
  }, [params])

  if (result === undefined) {
    return <Text>计算中</Text>
  } else {
    const [tiles, agari, hora] = result
    return <HoraView tiles={tiles} agari={agari} hora={hora} />
  }
}

export default HoraResult
