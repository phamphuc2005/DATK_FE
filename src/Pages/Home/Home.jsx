import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Form, Input, Modal } from 'antd';

import { PlusOutlined, DeleteFilled, UndoOutlined, DeleteOutlined, UserOutlined, DatabaseOutlined, BarChartOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';

function Trash() {
  const navigate = useNavigate();
  const [ allSystems, setAllSystems ] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetAllSystems();
    }
  }, [navigate, location]);

  const GetAllSystems = async () => {
    const data = await getRequest('/get-trash');
    setAllSystems(await data);
    console.log(await data);
  }

  return(
    <div className="device-list page-component">
      <Breadcrumb className='breadcrumb'>
        <Breadcrumb.Item className='current'>Trang chủ</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'> Trang chủ</h1>
      <div className='grid_container'>
        <div className="home_item" onClick={()=>( navigate('/update-info'))}>
          <div className='header-icon'><UserOutlined /></div>
          <div className='text-item'>Quản lý tài khoản</div>
        </div>
        <div className="home_item" onClick={()=>( navigate('/list-device'))}>
          <div className='header-icon'><DatabaseOutlined /></div>
          <div className='text-item'>Quản lý thiết bị</div>
        </div>
        <div className="home_item" onClick={()=>( navigate('/statistics'))}>
          <div className='header-icon'><BarChartOutlined /></div>
          <div className='text-item'>Thống kê số liệu</div>
        </div>
      </div>
    </div>
  )
}

export default Trash