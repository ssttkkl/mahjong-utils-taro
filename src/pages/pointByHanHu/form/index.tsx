import React, {useState} from "react"
import {AtButton, AtForm, AtInput} from "taro-ui"
import {useToast} from "taro-hooks";
import './index.scss'

export interface PointByHanHuFormValues {
  han: number
  hu: number
}

export const PointByHanHuForm: React.FC<{
  onSubmit: (values: PointByHanHuFormValues) => Promise<void>
}> = (props) => {
  const [showToast] = useToast()
  const [hanValue, setHanValue] = useState("")
  const [hanError, setHanError] = useState(false)

  const [huValue, setHuValue] = useState("")
  const [huError, setHuError] = useState(false)

  const onSubmit = async () => {
    let valid = true

    // validate tiles
    const han = Number.parseInt(hanValue)
    if (hanValue.length === 0
      || han === undefined
      || han < 1) {
      setHanError(true)
      valid = false
    } else {
      setHanError(false)
    }

    const hu = Number.parseInt(huValue)
    if (huValue.length === 0
      || hu === undefined
      || hu !== 25 && hu % 10 !== 0) {
      setHuError(true)
      valid = false
    } else {
      setHuError(false)
    }

    if (valid) {
      await props.onSubmit({
        han, hu
      })
    } else {
      showToast({title: '请检查输入', icon: 'error'})
        .catch(e => console.error(e))
    }
  }

  return (
    <AtForm onSubmit={onSubmit}>
      <AtInput
        name='han'
        title='番数'
        type='number'
        placeholder='示例：3'
        value={hanValue}
        onChange={v => setHanValue(v.toString())}
        error={hanError}
        required
      />
      <AtInput
        name='hu'
        title='符数'
        type='number'
        placeholder='示例：40'
        value={huValue}
        onChange={v => setHuValue(v.toString())}
        error={huError}
        required
      />
      <AtButton formType='submit' type='primary'>计算</AtButton>
    </AtForm>
  )
}
