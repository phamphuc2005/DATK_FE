import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Form, Input, Modal } from 'antd';

import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import { toast } from 'react-toastify';

function Statistics() {
  const navigate = useNavigate();
  const [ allSystems, setAllSystems ] = useState([]);
  const [ isShowModal, setShowModal ] = useState(false);
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
    const data = await getRequest('/systems');
    setAllSystems(await data);
    console.log(await data);
  }
  
  const showModal = () => {
    setShowModal(true);
  }

  const handleOk = async (value) => {
    console.log(value);
    console.log(localStorage.getItem('user_id'));
    const data = await postRequest('/add-device', {
      name: value.name,
      deviceID: value.deviceID,
      userID: localStorage.getItem('user_id')
    });
    const error = await data.message;
    if (error) {
      toast.error(error);
    }
    else {
      toast.success('Thành công!');
      // window.location.reload();
      setShowModal(false)
      navigate('/list-device');
    }
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const HandleViewDetail = (value) => {
    navigate(`/statistic/${value}`);
  }

  return(
    <div className="device-list page-component">
      <Breadcrumb className='breadcrumb'>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Thống kê số liệu</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'>Thống kê số liệu</h1>
      {allSystems.length > 0 ?
        <div className='grid-container' style={{marginTop:'40px'}}>
          {allSystems.map((e, index) => 
            // <DeviceItem
            //   key={index}
            //   id={e._id}YYYYYY
            //   deviceID={e.deviceID}
            //   name={e.name}
            //   state={e.state}
            // />
            <div className="device-item" onClick={()=>HandleViewDetail(e.deviceID)}>
            <div className='text-content'>
              <div className="device-item-text"><b>ID:</b> {e.deviceID}</div>
              <div className='device-item-text'><b>Tên thiết bị:</b> {e.name}</div>
            </div>
          </div>
          )}
        </div> :
        <div className='no-data'>Danh sách trống</div>
      }
    </div>
  )
}

export default Statistics