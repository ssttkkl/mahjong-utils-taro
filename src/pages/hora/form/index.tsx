import {Furo, Tile, Wind} from "mahjong-utils"
import React, {useEffect, useMemo, useState} from "react"
import {AtButton, AtCheckbox, AtForm, AtInput, AtList, AtListItem, AtRadio} from "taro-ui"
import {ExtraYaku, getAllExtraYaku} from "mahjong-utils/dist/hora/yaku";
import {Picker, View} from "@tarojs/components";
import {useToast} from "taro-hooks";
import './index.scss'
import {Panel} from "../../../components/Panel";
import {extraYakuForRon, extraYakuForTsumo, yakuName} from "../../../utils/yaku";
import {TilesInput} from "../../../components/TilesInput";

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

export const HoraForm: React.FC<{
  onSubmit: (values: HoraFormValues) => Promise<void>
}> = (props) => {
  const [showToast] = useToast()

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

    // validate total tiles number
    if (valid && (tiles?.length ?? 0) + furo.length * 3 !== 14) {
      showToast({
        title: '手牌（包括副露）必须由14张牌组成',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    if (valid && tiles?.find(x => x === agari) === undefined) {
      showToast({
        title: '所和的牌必须包含在手牌中',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    if (valid) {
      await props.onSubmit({
        tiles: tilesValue,
        agari: agariValue,
        furo: furoValues,
        tsumo: tsumo,
        dora,
        selfWind: windOptions[selfWindValue].value,
        roundWind: windOptions[roundWindValue].value,
        extraYaku
      })
    } else {
      showToast({title: '请检查输入', icon: 'error'})
        .catch(e => console.error(e))
    }
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
        title='宝牌'
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
      <Panel title='副露'>
        <AtList>
          {furoValues.map((furo, index) => {
            return <TilesInput
              key={index}
              name={`furo${index}`}
              value={furo}
              error={furoErrors[index]}
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
    </AtForm>
  )
}
