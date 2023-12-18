import {Furo, FuroType, Tile, Wind} from "mahjong-utils"
import React, {useEffect, useMemo, useState} from "react"
import {AtButton, AtCheckbox, AtForm, AtInput, AtList, AtListItem, AtRadio} from "taro-ui"
import {ExtraYaku, getAllExtraYaku} from "mahjong-utils/dist/hora/yaku";
import {Picker, View} from "@tarojs/components";
import {useModal, useToast} from "taro-hooks";
import './index.scss'
import {Panel} from "../../../components/Panel";
import {extraYakuForRon, extraYakuForTsumo, yakuName} from "../../../utils/yaku";
import {TilesInput} from "../../../components/TilesInput";
import {validateNumOfTiles} from "../../../utils/tiles";
import { BannerAd } from "../../../components/Ad/BannerAd";

export interface HoraFormValues {
  tiles: string
  agari: string
  tsumo: boolean
  furo: string[]
  dora: number
  selfWind: Wind
  roundWind: Wind
  extraYaku: ExtraYaku[]
}

const tsumoOptions = [
  {label: '自摸', value: "true"},
  {label: '荣和', value: "false"}
]

const windOptions = [
  {label: '东', value: Wind.East},
  {label: '南', value: Wind.South},
  {label: '西', value: Wind.West},
  {label: '北', value: Wind.North}
]

const furoParser = (x) => {
  const furo = Furo.parse(x)
  if (furo !== undefined) {
    if (furo.type === FuroType.Ankan) {
      return [undefined, furo.tile, furo.tile, undefined]
    }
    return furo.tiles
  }
  return Tile.parseTiles(x) ?? []
}

export const HoraForm: React.FC<{
  onSubmit: (values: HoraFormValues) => Promise<void>
}> = (props) => {
  const [showToast] = useToast()
  const [showFuroHelpModal] = useModal({
    title: "副露",
    content: "暗杠使用例如0330m（暗杠三万）的方式输入",
    showCancel: false
  })

  const [tilesValue, setTilesValue] = useState("")
  const [tilesError, setTilesError] = useState(false)

  const [agariValue, setAgariValue] = useState("")
  const [agariError, setAgariError] = useState(false)

  const [furoValues, setFuroValues] = useState<string[]>([])
  const [furoErrors, setFuroErrors] = useState<boolean[]>([])

  const [doraValue, setDoraValue] = useState("0")
  const [doraError, setDoraError] = useState(false)

  const [tsumo, setTsumo] = useState(true)
  const [selfWindValue, setSelfWindValue] = useState(0)
  const [roundWindValue, setRoundWindValue] = useState(0)

  const [extraYaku, setExtraYaku] = useState<ExtraYaku[]>([])

  const extraYakuOptions = useMemo(() => {
    return getAllExtraYaku().map(x => {
      let disabled = (tsumo ? extraYakuForTsumo : extraYakuForRon).find(y => x === y) === undefined
      if (x === 'Tenhou') {
        disabled ||= selfWindValue !== 0
        disabled ||= furoValues.length !== 0
      } else if (x === 'Chihou') {
        disabled ||= selfWindValue === 0
        disabled ||= furoValues.length !== 0
      } else if (x === 'Richi' || x === 'WRichi') {
        disabled ||= furoValues.length !== 0
      } else if (x === 'Ippatsu') {
        disabled ||= extraYaku.find(y => y === 'Richi' || y === 'WRichi') === undefined
      }
      return {
        value: x,
        label: yakuName[x],
        disabled: disabled
      }
    })
  }, [extraYaku, furoValues.length, selfWindValue, tsumo])

  // 当某些役被ban之后更新已选中的额外役
  useEffect(() => {
    const newExtraYaku = extraYaku.filter(x =>
      !(extraYakuOptions.find(y => x === y.value && y.disabled))
    )
    if (newExtraYaku.length !== extraYaku.length) {
      setExtraYaku(newExtraYaku)
    }
  }, [extraYaku, extraYakuOptions])

  const onClickAddFuro = () => {
    setFuroValues([...furoValues, ''])
  }

  const onClickRemoveFuro = (index: number) => {
    setFuroValues([...furoValues.slice(0, index), ...furoValues.slice(index + 1,)])
  }

  const onChangeFuro = (value: string, index: number) => {
    setFuroValues([...furoValues.slice(0, index), value, ...furoValues.slice(index + 1,)])
  }

  const onSubmit = async () => {
    let valid = true

    // validate tiles
    const tiles = Tile.parseTiles(tilesValue)
    if (tiles === undefined || tiles.length === 0) {
      setTilesError(true)
      valid = false
    } else {
      setTilesError(false)
    }

    // validate agari
    const agari = Tile.byText(agariValue)
    if (agari === undefined) {
      setAgariError(true)
      valid = false
    } else {
      setAgariError(false)
    }

    // validate dora
    const dora = Number.parseInt(doraValue)
    if (doraValue.length !== 0 && (!(/^(0|[1-9][0-9]*)$/.test(doraValue))
      || dora < 0 || dora > 200)) {
      setDoraError(true)
      valid = false
    } else {
      setDoraError(false)
    }

    // validate furo
    const furo = furoValues.map(v => Furo.parse(v))
    furo.forEach((x, index) => {
      if (x === undefined) {
        setFuroErrors([...furoErrors.slice(0, index), true, ...furoErrors.slice(index + 1,)])
        valid = false
      } else {
        setFuroErrors([...furoErrors.slice(0, index), false, ...furoErrors.slice(index + 1,)])
      }
    })

    if (!valid) {
      showToast({title: '请检查输入', icon: 'error'})
        .catch(e => console.error(e))
      return
    }

    // validate total tiles number
    // @ts-ignore
    if (!validateNumOfTiles([...tiles, ...furo.flatMap(x => x?.tiles)])) {
      showToast({
        title: '单种牌不能超过4张',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    const total = (tiles?.length ?? 0) + furo.length * 3
    if (total === 14 && tiles?.find(x => x === agari) === undefined) {
      showToast({
        title: '所和的牌必须包含在手牌中',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    } else if (total !== 14 && total !== 13) {
      showToast({
        title: '手牌枚数（包括副露）数量不足',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    await props.onSubmit({
      tiles: total === 14 ? tilesValue : Tile.tilesToString([...tiles, agari]),
      agari: agariValue,
      furo: furoValues,
      tsumo: tsumo,
      dora,
      selfWind: windOptions[selfWindValue].value,
      roundWind: windOptions[roundWindValue].value,
      extraYaku
    })
  }

  return (
    <AtForm onSubmit={onSubmit}>
      <TilesInput
        name='tiles'
        title='手牌'
        type='text'
        placeholder='示例：12233466m789p111z'
        value={tilesValue}
        onChange={v => setTilesValue(v.toString())}
        error={tilesError}
        required
      />
      <TilesInput
        name='agari'
        title='所和的牌'
        type='text'
        placeholder='示例：1z'
        value={agariValue}
        onChange={v => setAgariValue(v.toString())}
        error={agariError}
        required
      />
      <AtInput
        name='dora'
        title='宝牌数'
        type='digit'
        value={doraValue}
        onChange={v => setDoraValue(v.toString())}
        error={doraError}
      />
      <Picker
        mode='selector'
        range={windOptions}
        rangeKey='label'
        value={selfWindValue}
        onChange={e => setSelfWindValue(Number(e.detail.value))}
      >
        <AtList>
          <AtListItem
            title='自风'
            extraText={windOptions[selfWindValue].label}
            arrow='right'
          />
        </AtList>
      </Picker>
      <Picker
        mode='selector'
        range={windOptions}
        rangeKey='label'
        value={roundWindValue}
        onChange={e => setRoundWindValue(Number(e.detail.value))}
      >
        <AtList>
          <AtListItem
            title='场风'
            extraText={windOptions[roundWindValue].label}
            arrow='right'
          />
        </AtList>
      </Picker>
      <Panel title='副露' suffix={<View className='at-icon at-icon-help' onClick={() => showFuroHelpModal()} />}>
        <AtList>
          {furoValues.map((furo, index) => {
            return <TilesInput
              key={index}
              name={`furo${index}`}
              value={furo}
              error={furoErrors[index]}
              parser={furoParser}
              onChange={v => onChangeFuro(v.toString(), index)}
              placeholder='示例：789p'
            >
              <AtButton
                size='small'
                circle
                onClick={() => onClickRemoveFuro(index)}
              >
                <View className='at-icon at-icon-subtract'></View>
              </AtButton>
            </TilesInput>
          })}
          {furoValues.length < 4 ?
            <AtListItem title='添加' arrow='right' onClick={onClickAddFuro} />
            : null}
        </AtList>
      </Panel>
      <Panel title='自摸/荣和'>
        <AtRadio
          options={tsumoOptions}
          value={tsumo ? 'true' : 'false'}
          onClick={v => setTsumo(v === 'true')}
        />
      </Panel>

      <Panel title='额外役'>
        <AtCheckbox
          options={extraYakuOptions}
          selectedList={extraYaku}
          onChange={setExtraYaku}
        />
      </Panel>
      <AtButton formType='submit' type='primary'>计算</AtButton>
      <BannerAd />
    </AtForm>
  )
}
