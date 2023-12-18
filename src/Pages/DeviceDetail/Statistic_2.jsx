import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WarningOutlined, CheckCircleOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, DatePicker, Input, Modal, Select, Space, Switch, Table, Tabs, TimePicker } from 'antd';

import './DeviceDetail.css';
import './Statistic.css';
import { getRequest, postRequest } from '../../hooks/api';
import TempChart from './TempChart';
import {EditFilled, DeleteOutlined, ReloadOutlined} from '@ant-design/icons'
import moment from 'moment/moment';
import Charts from './Chart';
import { Option } from 'antd/es/mentions';
import { toast } from 'react-toastify';

export default function Statistic_2() {
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
  const [times, setTimes] = useState('')
  const [temp, setTemp] = useState([])
  const [humid, setHumid] = useState([])
  const [fire, setFire] = useState([])
  const [gas, setGas] = useState([])
  const [type, setType] = useState('date');
  const [types, setTypes] = useState('Giờ');

  const disabledDate = current => {
    return current && current >= moment().endOf('day');
  };

  const changeTimes = (value) => {
    setTimes(value);
  }

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

  // useEffect(() => {
  //   GetParam();
  // },[day])

  useEffect(() => {
    GetValue();
  },[type, times])

  const GetValue = async () => {
    const data = await postRequest(`/statistic_time/${deviceID}`, {
      type: type, 
      times: times
    })
    if (data && type === 'date') {
      data.data.map(data=> {
        temp.push(data.temp)
        humid.push(data.humid)
        fire.push(data.fire)
        gas.push(data.gas)
        time.push(`${moment(data.hour).format('HH')}`)
      })
      setTime(time.slice(-24));
      setTemp(temp.slice(-24));
      setHumid(humid.slice(-24));
      setFire(fire.slice(-24));
      setGas(gas.slice(-24));
      setTypes('Giờ');
    } else if (data && type === 'year') {
      data.data.map(data=> {
        temp.push(data.temp)
        humid.push(data.humid)
        fire.push(data.fire)
        gas.push(data.gas)
        time.push(`${moment(data.month).format('MM')}`)
      })
      setTime(time.slice(-12));
      setTemp(temp.slice(-12));
      setHumid(humid.slice(-12));
      setFire(fire.slice(-12));
      setGas(gas.slice(-12));
      setTypes('Tháng')
    } else if (data && type === 'month') {
      console.log(data);
      data.data.map(data=> {
        temp.push(data.temp)
        humid.push(data.humid)
        fire.push(data.fire)
        gas.push(data.gas)
        time.push(`${moment(data.day).format('DD')}`)
      })
      setTime(time.slice(-data.days));
      setTemp(temp.slice(-data.days));
      setHumid(humid.slice(-data.days));
      setFire(fire.slice(-data.days));
      setGas(gas.slice(-data.days));
      setTypes('Ngày')
    } else {
      toast.error('Lỗi!')
    }
  }


  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between'}}>
        <Button 
            className='delete-button' 
            onClick={()=>{window.location.reload()}}
            size='middle'
            style={{marginTop:'0'}}
          ><ReloadOutlined />Làm mới
        </Button>
        <Space style={{alignItems:'end'}}>
          <Select value={type} onChange={setType}>
            <Option value="date">Ngày</Option>
            {/* <Option value="week">Tuần</Option> */}
            <Option value="month">Tháng</Option>
            <Option value="year">Năm</Option>
          </Select>
          <DatePicker disabledDate={disabledDate} picker={type}  onChange={(value) => changeTimes(value)} />
        </Space>
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


<div className='grid-chart-content'>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={temp} 
            name='Nhiệt độ' 
            color='#ffff00'  
            types={types}
          />
          {/* <h3 style={{color: '#ffff00'}}>Biểu đồ nhiệt độ</h3> */}
        </div>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={humid} 
            name='Độ ẩm' 
            color='#0000ff'
            types={types}
          />
          {/* <h3 style={{color: '#0000ff'}}>Biểu đồ độ ẩm</h3> */}
        </div>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={gas} 
            name='Gas'
            color='#00ff00'
            types={types}
          />
          {/* <h3 style={{color: '#00ff00'}}>Biểu đồ gas</h3> */}
        </div>
        <div className='chart-box'>
          <Charts
            time={time} 
            val={fire} 
            name='Lửa'
            color='#ff0000'
            types={types}
          />
          {/* <h3 style={{color: '#ff0000'}}>Biểu đồ lửa</h3> */}
        </div>
      </div>
    </div>
  )
}