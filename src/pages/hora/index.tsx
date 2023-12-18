import React from "react";
import Taro from "@tarojs/taro";
import { buildSearchParams } from "../../utils/searchParams";
import { HoraForm } from "./form";
import './index.scss'
import Page from "../../components/Page";

const HoraPage: React.FC = () => {
  async function onSubmit(values) {
    Taro.navigateTo({
      url: `/pages/hora/result/index?${buildSearchParams(values)}`
    })
  }

  return (
    <Page title='和牌分析'>
      <HoraForm onSubmit={onSubmit} />
    </Page>
  )
}

export default HoraPage
