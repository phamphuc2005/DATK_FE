import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const TIME_RANGE_IN_MILLISECONDS = 30 * 1000;
const ADDING_DATA_INTERVAL_IN_MILLISECONDS = 1000;
// const ADDING_DATA_RATIO = 0.8;

export default function TempChart({ val, name, color }) {
  const nameList = [name];
  const [isColor, setIsColor] = useState(color)
  const defaultDataList = nameList.map((name) => ({
    name: name,
    data: []
  }));
  const [ dataList, setDataList ] = useState(defaultDataList);

  useEffect(() => {
    const addDataRandomly = (data) => {
      // if (Math.random() < 1 - ADDING_DATA_RATIO) {
      //   return data;
      // }
      return [
        ...data,
        {
          x: new Date().toISOString(),
          // y: data.length * Math.random()
          y: val
        }
      ];
    };
    const interval = setInterval(() => {
      setDataList(
        dataList.map((val) => {
          return {
            name: val.name,
            data: addDataRandomly(val.data)
          };
        })
      );
    }, ADDING_DATA_INTERVAL_IN_MILLISECONDS);

    return () => clearInterval(interval);
  }, [dataList, val]);

  const options = {
    title: { text: `Biểu đồ ${name}`, style: {color: isColor, textTransform: 'uppercase', fontSize:  '18px', fontWeight:  'bold'} },
    chart: {
      zoom: {
        enabled: false
      },
      animations: {
        easing: "linear",
        dynamicAnimation: {
          speed: 500
        }
      }
    },
    tooltip: {
      x: {
        format: "HH:mm:ss dd/MM/yyyy "
      }
    },
    xaxis: {
      type: "datetime",
      range: TIME_RANGE_IN_MILLISECONDS,
      labels: {
        datetimeUTC: false
      },
      title: { text: "Thời gian", style: {color: isColor, fontSize: '14px'} },
    },
    yaxis: {
      labels: {
        formatter: val => val.toFixed(0)
      },
      title: { text: "Giá trị", style: {color: isColor, fontSize: '14px'} },
    },
    colors: [isColor]
  };

  return(
    <Chart
      type='line'
      options={options}
      series={dataList}
    />
  )
}