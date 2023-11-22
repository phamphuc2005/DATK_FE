import { Switch } from 'antd';
import { useNavigate } from 'react-router-dom';

import './DeviceItem.css';
import { getRequest } from '../../hooks/api';
import { useState } from 'react';

export default function DeviceItem({ id, deviceID, name, state, location }) {
  const navigate = useNavigate();
  const [sysState, setSysState] = useState(state)

  const HandleViewDetail = () => {
    navigate(`/detail/${deviceID}`);
  }

  const StopPropagation = (e) => {
    e.stopPropagation();
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

  return(
    <div className="device-item" onClick={HandleViewDetail}>
      <div className='text-content'>
        <div className="device-item-text"><b>ID:</b> {deviceID}</div>
        <div className='device-item-text'><b>Tên thiết bị:</b> {name}</div>
        <div className='device-item-text'><b>Khu vực:</b> {location.name} - {location.locationID}</div>
      </div>
      <div className="switch-button-box" onClick={StopPropagation}>
        <Switch 
          className='switch-button' 
          defaultChecked={state}
          checkedChildren='Bật'
          unCheckedChildren='Tắt'
          onClick={ChangeState}
        />
      </div>
    </div>
  )
}