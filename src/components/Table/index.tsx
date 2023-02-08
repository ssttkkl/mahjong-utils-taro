/**
 * 从OSSA偷过来的表格组件
 * 
 * https://github.com/NeteaseYanxuan/OSSA/blob/main/packages/ossa-demo/src/components/demoTable/index.tsx
 * 
 * @param {object} list 渲染数据
 * @param {string} list.title 标题
 * @param {array<string>} list.head 表头
 * @param {array<object>} list.data 列表数据
 */

import React from "react";
import { View, ViewProps } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";

export const Table: React.FC<TableProps> = ({ title, columns, data, ...props }) => {
  const rootClassName = [
    "table",
    "table__title",
    "table__content",
    "table__head",
    "table__head__item",
  ];

  return (
    <View className={classNames(rootClassName[0])} {...props}>
      {title && (
        <View className={classNames(rootClassName[1])}>
          {title}
        </View>
      )}

      <View className={classNames(rootClassName[2])}>
        <View className={classNames(rootClassName[3])}>
          {columns.map((col: Column) => (
            <View className={classNames(rootClassName[4])}
              style={{ flex: col.flex ?? 1 }}
              key={`${col.key}-header`}>
              {col.title}
            </View>
          ))}
        </View>
        {data.map((item: any, i: number) => (
          <View className='table__tr' key={i}>
            {columns.map((col: Column) => (
              <View className='table__td'
                style={{ flex: col.flex ?? 1 }}
                key={`${col.key}-${i}`}>
                {col.render ? col.render(item[col.key], item, i) : item[col.key]}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export interface Column {
  title: string;
  key: string;
  dataIndex: string | number;
  render: (value: any, record: any, index: number) => React.ReactNode;
  flex?: number;
}

export interface TableProps extends ViewProps {
  title?: string;
  columns: Column[];
  data: any[];
}
