import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WarningOutlined, CheckCircleOutlined, CaretLeftOutlined, CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Input, Modal, Switch, Table } from 'antd';

import './DeviceDetail.css';
import './Statistic.css';
import { getRequest, postRequest } from '../../hooks/api';
import TempChart from './TempChart';
import {EditFilled, DeleteOutlined, ReloadOutlined} from '@ant-design/icons'
import moment from 'moment/moment';
import Charts from './Chart';
import { toast } from 'react-toastify';

export default function MemberLocation() {
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const [ location, setLocation ] = useState({});
  const [ member, setMember ] = useState([]);
  const [ requests, setRequests ] = useState([]);
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
    const GetSystem = async () => {
      const data = await getRequest(`/location/${_id}`);
      if (data) {
        setLocation(data);
      }
    }
    GetSystem();

  }, [navigate, _id]);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    GetMember();
    
  }, [navigate, _id]);
  
  const GetMember = async () => {
    const data = await getRequest(`/member_location/${_id}`);
    if (data) {
      setMember(data);
    }
  }
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    GetRequests();
    
  }, [navigate, _id]);
  
  const GetRequests = async () => {
    const data = await getRequest(`/request_location/${_id}`);
    if (data) {
      setRequests(data);
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
          GetMember();
          GetRequests();
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
          GetMember();
          GetRequests();
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
          GetMember();
          GetRequests();
        }
      },
    })
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      align: 'center',
    },
    (location.role === 'Admin' ?
      {
        title: 'Hành động',
        align: 'center',
        render: (text, record) => 
          (record.role !== 'Admin' && location.role === 'Admin' ?
            <Button danger onClick={()=>deleteMember(record)}>Xóa</Button>:
            <></>
          )
      } : {}
    )
  ];

  const column_ = [
    {
      title: 'Tên',
      dataIndex: 'name',
      align: 'center',
      // render: (text) => moment(text).format('DD/MM/YYYY')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => <div style={{display:'inline-flex', gap: '10px'}}>
        <Button type="primary" ghost onClick={()=>acceptRequest(record.request_id)}>Chấp nhận</Button>
        <Button danger onClick={()=>denyRequest(record.request_id)}>Từ chối</Button>
      </div>
      
    },
  ];

  const showModal = () => {
    setShowModal(true);
  }

  const addMember = async () => {
    const email = document.getElementById('member-email').value;
    if (email === '') { toast.warning('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await await postRequest('/add-member', {
        email: email,
        userID: localStorage.getItem('user_id'),
        locationID: _id
      });

      const error = await data.message;
      if (error) {
        toast.error(error);
        setShowModal(false);
      }
      else {
        toast.success('Thành công!');
        setShowModal(false);
        GetMember();
        GetRequests();
      }
    }
  }

  return (
    <div ref={boxWarning} className="device-detail page-component">
      <Breadcrumb className='breadcrumb' style={{marginLeft: '0px'}}>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item> <a onClick={()=>(navigate('/location'))}>Khu vực</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Quản lý thành viên</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'>Quản lý thành viên</h1>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
        <Button 
            className='delete-button' 
            onClick={()=>{window.location.reload()}}
            size='middle'
          ><ReloadOutlined />Làm mới
        </Button>
        {location && location.role === 'Admin' ?
          <button 
          className='add-button'
          // type="primary"
          onClick={showModal}
          style={{margin:'40px 0 0 20px'}}
        ><PlusOutlined /> Thêm thành viên</button> :
        <></>
        }
      </div>
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
        <h3 style={{textAlign:'center', marginBottom:'20px'}}>Danh sách thành viên</h3>
        <Table
          size='small'
          columns={columns}
          dataSource={member}
          bordered
          style={{width:'100%'}}
          scroll={{
            x: 100,
          }}
          // title={() => 'Header'}
          // footer={() => 'Footer'}
        />
      </div>
      
      {location && location.role === 'Admin' ?
        <div className="param-content" style={{display:'flow'}}>
          <h3 style={{textAlign:'center', marginBottom:'20px'}}>Danh sách xin gia nhập</h3>
          <Table
            size='small'
            columns={column_}
            dataSource={requests}
            bordered
            style={{width:'100%'}}
            scroll={{
              x: 100,
            }}
          />
        </div> :
        <></>
      }
      
      <Modal
        title="Thêm thành viên"
        open={isShowModal} 
        onOk={addMember} 
        onCancel={()=>setShowModal(false)} 
        okText="Xác nhận" 
        cancelText="Hủy"
        destroyOnClose
      >
        <div id='update-name-box' className="update-name-box">
          <Input id='member-email' placeholder='Nhập email người dùng'/>
        </div>
      </Modal>
    </div>
  )
}