import { useEffect, useRef, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { WarningOutlined, CheckCircleOutlined, CaretLeftOutlined, CaretRightOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import { Breadcrumb, Button, Input, Modal, Switch, Table, Form } from 'antd';

import './DeviceDetail.css';
import './Statistic.css';
import { getRequest, postRequest } from '../../hooks/api';
import TempChart from './TempChart';
import {EditFilled, DeleteOutlined, ReloadOutlined} from '@ant-design/icons'
import moment from 'moment/moment';
import Charts from './Chart';
import { toast } from 'react-toastify';

export default function DeviceLocation() {
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const [ location, setLocation ] = useState({});
  const [ member, setMember ] = useState([]);
  const [ devicess, setDevicess ] = useState([]);
  const [ device, setDevice ] = useState({});
  const [ param, setParam ] = useState([]);
  const [ val, setVal ] = useState({});
  const [ sysState, setSysState ] = useState();
  const boxWarning = useRef(null);
  const [ isShowUpdateName, setIsShowUpdateName ] = useState(false);
  const [ isShowModal, setShowModal ] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    const GetLocation = async () => {
      const data = await getRequest(`/location/${_id}`);
      if (data) {
        setLocation(data);
      }
    }
    GetLocation();

  }, [navigate, _id]);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    GetDevices();
    
  }, [navigate, _id]);
  
  const GetDevices = async () => {
    const data = await getRequest(`/get-devices/${_id}`);
    if (data) {
      setDevicess(data);
    }
  }

  const deleteMember = async (member) => {
    Modal.confirm({
      title: `Xóa thành viên`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa thành viên này không?`,
      async onOk() {
        const data = await postRequest('/delete-member', {
          _id: member.member_id,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          GetDevices();
        }
      },
    })
  }

  const acceptRequest = async (_id) => {
    Modal.confirm({
      title: `Chấp nhận yêu cầu`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn chấp nhận yêu cầu này không?`,
      async onOk() {
        const data = await postRequest('/accept-request', {
          _id: _id,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          GetDevices();
        }
      },
    })
  }

  const denyRequest = async (_id) => {
    Modal.confirm({
      title: `Từ chối yêu cầu`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn từ chối yêu cầu này không?`,
      async onOk() {
        const data = await postRequest('/deny-request', {
          _id: _id,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          GetDevices();
        }
      },
    })
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
      userID: localStorage.getItem('user_id'),
      locationID: _id
    });
    const error = await data.message;
    if (error) {
      toast.error(error);
    }
    else {
      toast.success('Thành công!');
      // window.location.reload();
      setShowModal(false)
      GetDevices();
    }
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  const OpenUpdateNameBox = (e) => {
    setIsShowUpdateName(true)
    setDevice(e)
  }

  const CloseUpdateNameBox = () => {
    setIsShowUpdateName(false)
  }

  const UpdateName = async () => {
    const newName = document.getElementById('new-device-name').value;
    if (newName === '') { toast.warning('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await getRequest(`/system-name/${device._id}?name=${newName}`);
      const error = await data.message;
      if (error) {
        toast.error(error);
      }
      else {
        console.log(await data);
        setIsShowUpdateName(false)
        toast.success('Thành công!')
        GetDevices();
      }

    }
  }

  const removeDevice = async (e) => {
    Modal.confirm({
      title: `Xóa thiết bị`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa thiết bị này không?`,
      async onOk() {
        const data = await postRequest('/remove-device', {
          _id: e._id,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          // window.location.reload();
          GetDevices();
        }
      },
    })
  }

  const column_ = [
    {
      title: 'Mã thiết bị',
      dataIndex: 'deviceID',
      align: 'center',
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      align: 'center',
      // render: (text) => moment(text).format('DD/MM/YYYY')
    },
    (location.role === 'Admin' ?
    {
      title: 'Hành động',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => <div style={{display:'inline-flex', gap: '10px'}}>
        <Button type="primary" ghost onClick={()=>OpenUpdateNameBox(record)}>Đổi tên</Button>
        <Button danger onClick={()=>removeDevice(record)}>Xóa</Button>
      </div>
      
    } : {}
    ),
  ];

  return (
    <div ref={boxWarning} className="device-detail page-component">
      <Breadcrumb className='breadcrumb' style={{marginLeft: '0px'}}>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item> <a onClick={()=>(navigate('/location'))}>Khu vực</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Quản lý thiết bị</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'>Quản lý thiết bị</h1>
      {location.role === 'Admin' ?
        <div style={{display: 'flex', justifyContent: 'space-between', margin:'40px 0px 20px 0px'}}>
          <button 
            className='add-button'
            // type="primary"
            onClick={showModal}
          ><PlusOutlined /> Thêm thiết bị</button>
          <Button 
          // className='add-button'
          // type="primary"
          size='large'
          onClick={()=>{navigate(`/trash/${_id}`)}}
          danger
          ><DeleteFilled /> Thùng rác</Button>
        </div> : 
        <div style={{margin:'0px 0px 20px 0px'}}>
          <Button 
            className='delete-button' 
            onClick={()=>{window.location.reload()}}
            size='large'
          ><ReloadOutlined />Làm mới
        </Button>
        </div>
      }
      <div className='device-info' style={{display:'inherit', marginTop:'10px'}}>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <div className='text-content id-content' style={{marginBottom:'0'}}>
            <b>Mã khu vực:</b> {location.locationID}
          </div>
          <div className="name-content">
            <div className='text-content'>
              <b>Tên khu vực:</b> {location.name}
            </div>
          </div>
        </div>
        
      </div>
      
        <div className="param-content" style={{display:'flow'}}>
          <h3 style={{textAlign:'center', marginBottom:'20px'}}>Danh sách thiết bị</h3>
          <Table
            size='small'
            columns={column_}
            dataSource={devicess}
            bordered
            style={{width:'100%'}}
            pagination={false}
            scroll={{
              x: 100,
            }}
          />
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
                  {/* <button
                    style={{ backgroundColor: 'rgb(73, 221, 73)', color: 'white' }}
                    onClick={UpdateName}
                  >Xác nhận</button> */}
                  {/* <button
                    style={{ backgroundColor: 'red', color: 'white' }}
                    onClick={CloseUpdateNameBox}
                  >Hủy</button> */}
                </div>
              </Modal>
      
    </div>
  )
}