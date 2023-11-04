import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Form, Input, Modal } from 'antd';

import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import { toast } from 'react-toastify';

function List() {
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

  return(
    <div className="device-list page-component">
      <Breadcrumb className='breadcrumb'>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Home</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Devices List</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'> Danh sách thiết bị</h1>
      <div style={{display: 'flex', justifyContent: 'space-between', margin:'40px 20px 0 20px'}}>
        <button 
          className='add-button'
          // type="primary"
          onClick={showModal}
        ><PlusOutlined /> Thêm thiết bị</button>
        <Button 
        // className='add-button'
        // type="primary"
        size='large'
        onClick={()=>{navigate('/trash')}}
        danger
        ><DeleteFilled /> Thùng rác</Button>
      </div>
      <Modal
        title="Thêm thiết bị"
        open={isShowModal}
        // onOk={handleOk} 
        onCancel={handleCancel}
        // okText={'Thêm'}
        // cancelText={'Hủy'}
        okButtonProps={{style:{display:'none'}}}
        cancelButtonProps={{style:{display:'none'}}}
        destroyOnClose
      >
        <Form
          name="basic"
          labelCol={{
            span: 0,
          }}
          wrapperCol={{
            span: 20,
          }}
          style={{
            maxWidth: 600,
          }}
          onFinish={handleOk}
          // onFinishFailed={onFinishFailed}
          // autoComplete="off"
        >
          <Form.Item
            label="Mã thiết bị"
            name="deviceID"
            rules={[
              {
                required: true,
                message: 'Hãy nhập mã thiết bị!',
              },
            ]}
          >
            <Input placeholder='Nhập mã thiết bị'/>
          </Form.Item>

          <Form.Item
            label="Tên thiết bị"
            name="name"
            rules={[
              {
                required: true,
                message: 'Hãy nhập tên thiết bị!',
              },
            ]}
          >
            <Input placeholder='Nhập tên thiết bị'/>
          </Form.Item>

          <Form.Item
            wrapperCol= {{
              offset: 16,
              span: 16,
            }}
            className='modal-btn'
          >
            <Button htmlType="button" onClick={handleCancel} style={{marginRight: '10px', marginLeft: '24px'}}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {allSystems.length > 0 ?
        <div className='grid-container'>
          {allSystems.map((e, index) => 
            <DeviceItem
              key={index}
              id={e._id}YYYYYY
              deviceID={e.deviceID}
              name={e.name}
              state={e.state}
            />
          )}
        </div> :
        <div className='no-data'>Danh sách trống</div>
      }
    </div>
  )
}

export default List