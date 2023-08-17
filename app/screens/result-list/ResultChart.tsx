import React, {FunctionComponent} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
// import {LineChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import {ResultChartData} from './ListViewModel';
import {getSpace, Spaces} from '../../styles/spaces';
import {getColor, Colors} from '../../styles/colors';
import {FontStyles, getName} from '../../styles/fonts/names';
import {Sizes, getSize} from '../../styles/fonts/sizes';
// import * as shape from 'd3-shape';
import {Circle} from 'react-native-svg';

export type ResultChartProps = {
  chartData: ResultChartData;
  maxScore: number;
};

const styles = StyleSheet.create({
  chartContainerStyle: {
    marginTop: getSpace(Spaces.large),
    paddingHorizontal: getSpace(Spaces.small),
    paddingVertical: getSpace(Spaces.small),
    flex: 1,
  },
  chartStyle: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: getSpace(Spaces.small),
    paddingVertical: getSpace(Spaces.small),
  },
  xAxisStyle: {
    marginVertical: getSpace(Spaces.subMedium),
    paddingLeft: getSpace(Spaces.xxLarge),
  },
  yAxisStyle: {
    marginVertical: -getSpace(Spaces.subMedium),
  },
});

const createXAxisLabel = (chartData: ResultChartData) => {
  return (chartData &&
    chartData.map((data) => {
      return data.xAxisLabel;
    })) as Array<string>;
};

const createYAxisLabel = (chartData: ResultChartData) => {
  return (chartData &&
    chartData.map((data) => {
      return data.value;
    })) as Array<number>;
};

// const ChartPoints = ({x, y, color, xAxisData, chartData}) =>
//   chartData.map((item, index) => (
//     <Circle
//       key={index}
//       cx={x(xAxisData[index])}
//       cy={y(item.value)}
//       r={6}
//       stroke={getColor({color: Colors.buttonFill})}
//       fill={getColor({color: Colors.buttonFill})}
//     />
//   ));

const ResultChart: FunctionComponent<ResultChartProps> = (
  props: ResultChartProps,
) => {
  const {chartData, maxScore} = props;

  const chartStyle = [
    styles.chartStyle,
    {
      height: Dimensions.get('window').height / 3,
      marginHorizontal: getSpace(Spaces.large),
    },
  ];
  const contentInset = {
    top: getSpace(Spaces.largePlus),
    bottom: getSpace(Spaces.largePlus),
    left: getSpace(Spaces.largePlus),
  };
  const contentInsetXAxis = {
    left: getSpace(Spaces.xxLarge),
    right: getSpace(Spaces.xxLarge),
  };

  const xAxisData = createXAxisLabel(chartData);
  const yAxisData = createYAxisLabel(chartData);

  return chartData && chartData.length > 0 ? (
    <View style={styles.chartContainerStyle}>
      <View style={{flexDirection: 'row'}}>
        {/* <YAxis
          style={styles.yAxisStyle}
          data={yAxisData}
          contentInset={contentInset}
          min={0}
          max={maxScore}
          svg={{
            fill: getColor({color: Colors.white}),
            fontSize: getSize(Sizes.xSmall),
            fontFamily: getName(FontStyles.bold),
          }}
        />
        <LineChart
          style={chartStyle}
          data={chartData}
          yMin={0}
          yMax={maxScore}
          yAccessor={({item}) => item.value}
          curve={shape.curveLinear}
          svg={{
            stroke: getColor({color: Colors.white}),
            strokeWidth: 2,
          }}
          contentInset={contentInset}>
          <Grid
            svg={{
              stroke: getColor({color: Colors.white, opacity: 40}),
            }}
            direction={'HORIZONTAL'}
          />
          {chartData.length === 1 ? (
            <ChartPoints
              chartData={chartData}
              xAxisData={xAxisData}
              color="#003F5A"
            />
          ) : null}
        </LineChart>
      </View>
      <XAxis
        style={styles.xAxisStyle}
        data={xAxisData}
        contentInset={contentInsetXAxis}
        formatLabel={(index) => {
          return xAxisData[index];
        }}
        numberOfTicks={chartData.length}
        svg={{
          fill: getColor({color: Colors.white}),
          fontSize: getSize(Sizes.xSmall),
          fontFamily: getName(FontStyles.bold),
        }}
      /> */}
      </View>
    </View>
  ) : null;
};

export default ResultChart;
