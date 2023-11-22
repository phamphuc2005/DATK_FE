import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Form, Input, Modal } from 'antd';

import { PlusOutlined, DeleteFilled, UndoOutlined, DeleteOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';

function Trash() {
  const navigate = useNavigate();
  const [ allSystems, setAllSystems ] = useState([]);
  const location = useLocation();
  const { id: _id } = useParams();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetAllSystems();
    }
  }, [navigate, location]);

  const GetAllSystems = async () => {
    const data = await getRequest(`/get-trash/${_id}`);
    setAllSystems(await data);
    console.log(await data);
  }

  const handleRestore = async (value) => {
    console.log(value);
    Modal.confirm({
      title: `Khôi phục thiết bị`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn khôi phục thiết bị này không?`,
      async onOk() {
        const data = await postRequest('/restore-device', {
          _id: value._id,
          userID: localStorage.getItem('user_id')
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          GetAllSystems();
          toast.success('Thành công!');
        }
      },
    })
  }

  const handleDelete = async (value) => {
    Modal.confirm({
      title: `Xóa thiết bị`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa vĩnh viễn thiết bị này không?`,
      async onOk() {
        const data = await postRequest('/delete-device', {
          _id: value._id,
          userID: localStorage.getItem('user_id')
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          GetAllSystems();
          toast.success('Thành công!');
        }
      },
    })
  }

  return(
    <div className="device-list page-component">
      <Breadcrumb className='breadcrumb'>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item> <a onClick={()=>(navigate('/location'))}>Khu vực</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Thùng rác</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'> Thùng rác</h1>
      {allSystems.length > 0 ?
        <div className='grid_container'>
          {allSystems.map((e, index) => 
            // <DeviceItem
            //   key={index}
            //   id={e._id}YYYYYY
            //   deviceID={e.deviceID}
            //   name={e.name}
            //   state={e.state}
            // />
            <div className="device_item" style={{marginBottom:'0'}}>
              <div className='text_content'>
                <div className="device_item_text"><b>ID:</b> {e.deviceID}</div>
                <div className='device_item_text'><b>Tên thiết bị:</b> {e.name}</div>
              </div>
              <div className='trash-btn'>
                <button className='restore-btn' onClick={()=>handleRestore(e)}><UndoOutlined /> Khôi phục</button>
                <button className='delete-btn' onClick={()=>handleDelete(e)}><DeleteOutlined /> Xóa vĩnh viễn</button>
              </div>
            </div>
          )}
        </div> :
        <div className='no_data'>Thùng rác trống</div>
      }
    </div>
  )
}

export default Trash