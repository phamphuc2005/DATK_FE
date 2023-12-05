import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WarningOutlined, CheckCircleOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Input, Modal, Switch, Table } from 'antd';

import './DeviceDetail.css';
import './Statistic.css';
import { getRequest, postRequest } from '../../hooks/api';
import TempChart from './TempChart';
import {EditFilled, DeleteOutlined, ReloadOutlined} from '@ant-design/icons'
import moment from 'moment/moment';
import Charts from './Chart';

export default function Statistic() {
  const navigate = useNavigate();
  const { id: deviceID } = useParams();
  const [ system, setSystem ] = useState({});
  const [ param, setParam ] = useState([]);
  const [ val, setVal ] = useState({});
  const [ sysState, setSysState ] = useState();
  const boxWarning = useRef(null);
  const [ isShowUpdateName, setIsShowUpdateName ] = useState(false);
  const days = [];
  const [day, setDay] = useState(-7)
  const [time, setTime] = useState([])
  const [temp, setTemp] = useState([])
  const [humid, setHumid] = useState([])
  const [fire, setFire] = useState([])
  const [gas, setGas] = useState([])

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    const GetSystem = async () => {
      const data = await getRequest(`/system/${deviceID}`);
      if (data) {
        setSystem(data);
        const { state } = data
        if (state) {
          setSysState(true);
        } else setSysState(false);
        if(data.message) navigate('*')
      }
    }
    GetSystem();

    // GetParam();
  }, [navigate, deviceID]);

  useEffect(() => {
    GetParam();
  },[day])
  
  const GetParam = async () => {
    // console.log('days', days);
    const data = await postRequest(`/statistic/${deviceID}`, {
      time: days,
      // deviceID: deviceID
    });
    if (data) {
      setParam(data.data);
      data.data.map(data => {
        time.push(moment(data.day).format('DD/MM/YYYY'))
        temp.push(data.temp)
        humid.push(data.humid)
        fire.push(data.fire)
        gas.push(data.gas)
      })
      setTime(time.slice(-7));
      setTemp(temp.slice(-7));
      setHumid(humid.slice(-7));
      setFire(fire.slice(-7));
      setGas(gas.slice(-7));
    }
  }
console.log(time);

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date().setDate(new Date().getDate()+i+day)
    days.push(new Date(nextDate).toDateString())
  }

  const dateStrings = days.map((date) => {
    const day = moment(date).format('DD/MM/YYYY')
    return `${day}`;
  });

  const prevWeek = () => {
    setDay(day - 7);

  }

  const nextWeek = () => {
    setDay(day + 7);

  }

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'day',
      align: 'center',
      render: (text) => moment(text).format('DD/MM/YYYY')
    },
    {
      title: 'Nhiệt độ',
      dataIndex: 'temp',
      align: 'center',
      render: (text) => `${text}°C`
    },
    {
      title: 'Độ ẩm',
      dataIndex: 'humid',
      align: 'center',
      render: (text) => `${text}%`
    },
    {
      title: 'Lửa',
      dataIndex: 'fire',
      align: 'center',
    },
    {
      title: 'Gas',
      dataIndex: 'gas',
      align: 'center',
    },
  ];



  // console.log('time', temp);


  return (
    <div ref={boxWarning} className="device-detail page-component">
      <Breadcrumb className='breadcrumb' style={{marginLeft: '0px'}}>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item> <a onClick={()=>(navigate('/list-device'))}>Thống kê số liệu</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Số liệu trung bình</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'>Số liệu trung bình</h1>
      <div style={{ display:'flex', justifyContent:'space-between'}}>
        <Button 
            className='delete-button' 
            onClick={()=>{window.location.reload()}}
            size='middle'
          ><ReloadOutlined />Làm mới
        </Button>
        <div className='time'>
          <Button size='middle' onClick={()=>prevWeek()}><CaretLeftOutlined /></Button>
          <div className='time-input'>{dateStrings[0]} - {dateStrings[6]}</div>
          {day === -7 ?
          <Button disabled size='middle' ><CaretRightOutlined /></Button> :
          <Button size='middle' onClick={()=>nextWeek()} ><CaretRightOutlined /></Button>
          }
        </div>
      </div>
      <div className='device-info' style={{display:'inherit', marginTop:'20px'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <div>
            <div className='text-content id-content' style={{marginBottom:'0'}}>
              <b>Mã thiết bị:</b> {system.deviceID}
            </div>
            {/* <div className="name-content"> */}
              <div className='text-content' style={{marginTop:'10px'}}>
                <b>Tên thiết bị:</b> {system.name}
              </div>
            {/* </div> */}
          </div>
          <div>
            <div className='text-content'>
                <b>Khu vực:</b> {system.locationID ? system.locationID.name : ''}
            </div>
            <div className='text-content' style={{marginTop:'10px'}}>
                <b>ID:</b> {system.locationID ? system.locationID.locationID : ''}
            </div>
          </div>
        </div>
        
      </div>


      <div className="param-content">
        {/* <div className='text-content'>
          <b>Thời gian </b>
        </div>
        <div className='text-content'>
          <b>Nhiệt độ </b>
        </div>
        <div className='text-content'>
          <b>Độ ẩm </b>
        </div>
        <div className='text-content'>
          <b>Lửa </b>
        </div>
        <div className='text-content'>
          <b>Gas </b>
        </div> */}

        <Table
        size='small'
          columns={columns}
          dataSource={param}
          bordered
          style={{width:'100%'}}
          scroll={{
            x: 100,
          }}
          pagination={false}
          // title={() => 'Header'}
          // footer={() => 'Footer'}
        />
      </div>

      {/* {param.map(data => {
          return (
            <div className="param_content">
              <div className='text-content'>
                {moment(data.day).format('DD/MM/YYYY')}
              </div>
              <div className='text-content'>
                {data.temp}°C
              </div>
              <div className='text-content'>
                {data.humid}%
              </div>
              <div className='text-content'>
                {data.fire}
              </div>
              <div className='text-content'>
                {data.gas}
              </div>
            </div>
          )
      })} */}

<div className='grid-chart-content'>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={temp} 
            name='Nhiệt độ' 
            color='#ffff00'  
          />
          {/* <h3 style={{color: '#ffff00'}}>Biểu đồ nhiệt độ</h3> */}
        </div>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={humid} 
            name='Độ ẩm' 
            color='#0000ff'
          />
          {/* <h3 style={{color: '#0000ff'}}>Biểu đồ độ ẩm</h3> */}
        </div>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={gas} 
            name='Gas'
            color='#00ff00'
          />
          {/* <h3 style={{color: '#00ff00'}}>Biểu đồ gas</h3> */}
        </div>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={fire} 
            name='Lửa'
            color='#ff0000'
          />
          {/* <h3 style={{color: '#ff0000'}}>Biểu đồ lửa</h3> */}
        </div>
      </div>
      
    </div>
  )
}