import {View} from "@tarojs/components";
import {AtCardProps} from "taro-ui/types/card";
import {AtCard} from 'taro-ui'
import "taro-ui/dist/style/components/card.scss";
import React from "react";

export type CardProps = AtCardProps

export const Card: React.FC<CardProps> = ({ style, children, ...props }) => {
    return (<View style={style}>
        <AtCard {...props}>
            {children}
        </AtCard>
    </View>)
}
