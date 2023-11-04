import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export default function Charts({time, val, name, color }) {
  const [isColor, setIsColor] = useState(color)
  const [datalist, setDataList] = useState([])
  const [times, setTimes] = useState([])
  // console.log(time);
  
  useEffect(() => {
    const nameList = [name];
    const defaultDataList = nameList.map((name) => ({
      name: name,
      data: val
    }));
    setDataList(defaultDataList)
    setTimes(time)


  }, [time, val, name]);

  const options = {
    title: { text: `Biểu đồ ${name}`, style: {color: isColor, textTransform: 'uppercase', fontSize:  '18px', fontWeight:  'bold'} },
    chart: {
      zoom: {
        enabled: false
      },
    },
    xaxis: {
      categories: times,
      title: { text: "Thời gian", style: {color: isColor, fontSize: '14px'} },
    },
    yaxis: {
      title: { text: "Giá trị", style: {color: isColor, fontSize: '14px'} },
    },
    colors: [isColor]
  };

  return(
    <Chart
      type='line'
      options={options}
      series={datalist}
    />
  )
}