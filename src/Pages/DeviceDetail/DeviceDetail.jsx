import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WarningOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Input, Modal, Switch } from 'antd';

import './DeviceDetail.css';
import { getRequest, postRequest } from '../../hooks/api';
import TempChart from './TempChart';
import {EditFilled, DeleteOutlined, ReloadOutlined} from '@ant-design/icons'
import { Zoom, toast } from 'react-toastify';

export default function DeviceDetail() {
  const navigate = useNavigate();
  const { id: deviceID } = useParams();
  const [ system, setSystem ] = useState({});
  const [ val, setVal ] = useState({});
  const [ sysState, setSysState ] = useState();
  const boxWarning = useRef(null);
  const [ isShowUpdateName, setIsShowUpdateName ] = useState(false);


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

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    // setInterval(GetSystem, 10000);
    GetSystem();
  }, [navigate, deviceID]);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getRequest(`/system-params/${deviceID}`);
      console.log(data);
      if (data) {
        setVal(data);
      }
      // console.log(val);
    }, 3000);

    var interval2;
    var flagBackground = false;
    if (val?.warning) {
      interval2 = setInterval(async () => {
        if (!flagBackground) {
          document.body.style.backgroundColor = 'red';
          // toast.error("Danger !!!", {autoClose: 10, hideProgressBar: true, transition: Zoom})
      }
        else document.body.style.backgroundColor = 'white';
        flagBackground = !flagBackground
      }, 1000);
    } else document.body.style.backgroundColor = 'white';

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    }
  }, [deviceID, val?.warning]);

  const OpenUpdateNameBox = () => {
    // document.getElementById('update-name-box').classList.remove('hide');
    setIsShowUpdateName(true)
  }

  const CloseUpdateNameBox = () => {
    // document.getElementById('update-name-box').classList.add('hide');
    setIsShowUpdateName(false)
  }

  const UpdateName = async () => {
    const newName = document.getElementById('new-device-name').value;
    if (newName === '') { toast.warning('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await getRequest(`/system-name/${deviceID}?name=${newName}`);
      console.log(await data);
      setIsShowUpdateName(false)
      toast.success('Thành công!')
      const dataName = getRequest(`/system/${deviceID}`);
      setSystem(await dataName);
    }
  }

  const ChangeState = async () => {
    var state;
    if (sysState)
      state = 0;
    else state = 1;
    const data = await getRequest(`/system-state/${deviceID}?state=${state}`);
    console.log(await data);
    setSysState(!sysState);
  }

  const removeDevice = async () => {
    Modal.confirm({
      title: `Xóa thiết bị`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa thiết bị này không?`,
      async onOk() {
        const data = await postRequest('/remove-device', {
          id: deviceID,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          // window.location.reload();
          navigate('/list-device');
        }
      },
    })
  }

  return (
    <div ref={boxWarning} className="device-detail page-component">
      <Breadcrumb className='breadcrumb' style={{marginLeft: '0px'}}>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item> <a onClick={()=>(navigate('/list-device'))}>Danh sách thiết bị</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Chi tiết thiết bị</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'>Chi tiết thiết bị</h1>
      <div style={{ display:'flex', justifyContent:'space-between'}}>
        <Button 
            className='delete-button' 
            onClick={()=>{window.location.reload()}}
            size='middle'
          ><ReloadOutlined />Làm mới</Button>
          {/* <Button 
            className='delete-button' 
            type="primary" 
            danger
            onClick={removeDevice}
            size='large'
          ><DeleteOutlined />Xóa thiết bị</Button> */}
      </div>
      <div className='device-info'>
        <div>
          <div className='text-content id-content'>
            <b>Mã thiết bị:</b> {system.deviceID}
          </div>
          <div className="name-content">
            <div className='text-content'>
              <b>Tên thiết bị:</b> {system.name}
            </div>
            {/* <div className='update-name'>
              <button onClick={OpenUpdateNameBox}><EditFilled /> Đổi tên</button>
              <Modal
                title="Đổi tên"
                open={isShowUpdateName} 
                onOk={UpdateName} 
                onCancel={CloseUpdateNameBox} 
                okText="Xác nhận" 
                cancelText="Hủy"
                destroyOnClose
              >
                <div id='update-name-box' className="update-name-box">
                  <Input id='new-device-name' placeholder='Nhập tên mới'/>
                </div>
              </Modal>
            </div> */}
          </div>
          <div className='text-content' style={{marginTop:'10px'}}>
            <b>Khu vực:</b> {system.locationID ? system.locationID.name : ''} - {system.locationID ? system.locationID.locationID : ''}
          </div>
        </div>

        {
          val.message && val.message === 'disconnect' ?
          <div className='warning disconnect'>
            <LoadingOutlined /> Mất kết nối !
          </div> :
          <div>
          {sysState === false ?
            <div className='warning'></div> :
            <div>
            {
              val?.warning ?
              <div className='warning'>
                <WarningOutlined /> Nguy hiểm !!!
              </div>
              :
              <div className='warning ok-state'>
                <CheckCircleOutlined /> An toàn !
              </div>
            }
            </div>
          }  
          </div>
        }
        
        <div className='switch_button'>
        {
          <Switch
            className='switch-button'
            checked={sysState}
            checkedChildren='Bật'
            unCheckedChildren='Tắt'
            onClick={ChangeState}
          />
        }
        </div>
        
      </div>
      <div className="param-content">
        <div className='text-content'>
          <b>Nhiệt độ: </b> {val.temp}°C
        </div>
        <div className='text-content'>
          <b>Độ ẩm: </b> {val.humid}%
        </div>
        <div className='text-content'>
          <b>Lửa: </b> {val.fire}
        </div>
        <div className='text-content'>
          <b>Gas: </b> {val.gas}
        </div>
      </div>
      
      
      <div className='grid-chart-content'>
        <div className='chart-box'>
          <TempChart 
            val={val?.temp ? Math.round(val?.temp) : 0} 
            name='Nhiệt độ' 
            color='#ffff00'  
          />
          {/* <h3 style={{color: '#ffff00'}}>Biểu đồ nhiệt độ</h3> */}
        </div>
        <div className='chart-box'>
          <TempChart 
            val={val?.humid ? Math.round(val?.humid) : 0} 
            name='Độ ẩm' 
            color='#0000ff'
          />
          {/* <h3 style={{color: '#0000ff'}}>Biểu đồ độ ẩm</h3> */}
        </div>
        <div className='chart-box'>
          <TempChart 
            val={val?.gas ? Math.round(val?.gas) : 0} 
            name='Gas'
            color='#00ff00'
          />
          {/* <h3 style={{color: '#00ff00'}}>Biểu đồ gas</h3> */}
        </div>
        <div className='chart-box'>
          <TempChart 
            val={val?.fire ? Math.round(val?.fire) : 0} 
            name='Lửa'
            color='#ff0000'
          />
          {/* <h3 style={{color: '#ff0000'}}>Biểu đồ lửa</h3> */}
        </div>
      </div>
    </div>
  )
}