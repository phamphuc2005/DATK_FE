import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Form, Input, Modal, Select, Space } from 'antd';

import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import { toast } from 'react-toastify';
import { Option } from 'antd/es/mentions';

function List() {
  const navigate = useNavigate();
  const [ allSystems, setAllSystems ] = useState([]);
  const [ locations, setLocations ] = useState([]);
  const [ isShowModal, setShowModal ] = useState(false);
  const [ isLocation, setIsLocation ] = useState('All');
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetAllSystems();
    }
  }, [navigate, location, isLocation]);

  const GetAllSystems = async () => {
    const data = await getRequest(`/list-devices/${isLocation}`);
    setAllSystems(await data);
    console.log(await data);
  }

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetLocations();
    }
  }, [navigate, location]);

  const GetLocations = async () => {
    const data = await getRequest('/list-location');
    setLocations(await data);
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

  const handleChange = (key) => {
    setIsLocation(key)
  };
  
  const deviceManager = () => {
    if (isLocation == 'All') {
      navigate('/location');
    } else {
      navigate(`/device_location/${isLocation}`);
    }
  }

  return(
    <div className="device-list page-component">
      <Breadcrumb className='breadcrumb'>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Danh sách thiết bị</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'> Danh sách thiết bị</h1>
      <div style={{display:'flex', justifyContent:'space-between',margin:'40px 20px 0 20px'}}>
        <Space wrap>
          <Select
            defaultValue="All"
            style={{
              width: 170,
            }}
            onChange={handleChange}
            size='large'
          >
            {locations.map(location => (
              <Option key={location._id} value={location._id}>
                {`${location.name} - ${location.locationID}`}
              </Option>
            ))}
          </Select>
        </Space>
        <Button
          size='large' 
          type='primary' 
          onClick={()=>deviceManager()}
        >Quản lý thiết bị</Button>
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
              location={e.locationID}
            />
          )}
        </div> :
        <div className='no-data'>Danh sách trống</div>
      }
    </div>
  )
}

export default List