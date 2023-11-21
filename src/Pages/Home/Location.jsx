import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Dropdown, Form, Input, Modal } from 'antd';

import { PlusOutlined, DeleteFilled, MoreOutlined, SettingOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';

function Location() {
  const navigate = useNavigate();
  const [ locations, setLocations ] = useState([]);
  const [ isShowAddModal, setShowAddModal ] = useState(false);
  const [ isShowJoinModal, setShowJoinModal ] = useState(false);
  const location = useLocation();

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
  
  const showAddModal = () => {
    setShowAddModal(true);
  }

  const showJoinModal = () => {
    setShowJoinModal(true);
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
      setShowAddModal(false)
      navigate('/list-device');
    }
  }

  const handleCancel = () => {
    setShowAddModal(false)
  }

  const HandleViewDetail = (value) => {
    navigate(`/location-detail/${value}`);
  }

  const outLocation = async (location) => {
    console.log(location);
    Modal.confirm({
      title: `Rời khỏi khu vực`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn rời khỏi khu vực này không?`,
      async onOk() {
        const data = await postRequest('/out-location', {
          _id: location._id,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          GetLocations();
        }
      },
    })
  }

  const deleteLocation = async (location) => {
    console.log(location);
    Modal.confirm({
      title: `Xóa khu vực`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa khu vực này không?`,
      async onOk() {
        const data = await postRequest('/delete-location', {
          _id: location._id,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          GetLocations();
        }
      },
    })
  }

  const items = [
    {
      label: <a onClick={showAddModal}>Tạo mới khu vực</a>,
    },
    {
      label: <a onClick={showJoinModal}>Gia nhập khu vực</a>,
    },
    {
      label: <a onClick={()=>(navigate('/request'))}>Yêu cầu đã gửi</a>,
    },
    // {
    //   label: <a onClick={()=>(navigate('/'))}>Thùng rác</a>,
    // },
  ];

  const itemss = (e) => [
    {
      label: <a onClick={()=>(navigate(`/member_location/${e._id}`))}>Thành viên</a>,
    },
    {
      label: <a onClick={()=>(navigate(`/device_location/${e._id}`))}>Thiết bị</a>,
    },
    (e.role === 'Member' ?
    {
      label: <a onClick={()=>outLocation(e)}>Rời khu vực</a>,
    } : ''
    ),
    {
      label: (e.role === 'Admin' ?
        <a onClick={()=>deleteLocation(e)}>Xóa khu vực</a> : ''
      ) 
    },
  ];

    const StopPropagation = (e) => {
    e.stopPropagation();
  }
  
  const createLocal = async () => {
    const locationName = document.getElementById('new-location-name').value;
    if (locationName === '') { toast.warning('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await await postRequest('/add-location', {
        name: locationName,
        userID: localStorage.getItem('user_id')
      });

      const error = await data.message;
      if (error) {
        toast.error(error);
        setShowAddModal(false);
      }
      else {
        toast.success('Thành công!');
        setShowAddModal(false);
        GetLocations();
      }
    }
  }

  const joinLocal = async () => {
    const locationID = document.getElementById('join-location-id').value;
    if (locationID === '') { toast.warning('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await await postRequest('/join-location', {
        locationID: locationID,
        userID: localStorage.getItem('user_id')
      });

      const error = await data.message;
      if (error) {
        toast.error(error);
        setShowJoinModal(false);
      }
      else {
        toast.success('Thành công!');
        setShowJoinModal(false);
        // GetLocations();
      }
    }
  }

  return(
    <div className="device-list page-component">
      <div style={{display:'flex', justifyContent:'space-between', paddingRight:'20px'}}>
        <Breadcrumb className='breadcrumb'>
          <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
          <Breadcrumb.Item className='current'>Khu vực</Breadcrumb.Item>
        </Breadcrumb>
        <Dropdown
          menu={{
            items:items,
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <a>
            <div className='more'><SettingOutlined /></div>
          </a>
        </Dropdown>
      </div>
      <h1 className='component-title'>Danh sách khu vực</h1>
      {locations.length > 0 ?
        <div className='grid-container' style={{marginTop:'40px'}}>
          {locations.map((e, index) => 
            // <DeviceItem
            //   key={index}
            //   id={e._id}YYYYYY
            //   deviceID={e.deviceID}
            //   name={e.name}
            //   state={e.state}
            // />
            <div className="device-item" style={{alignItems:'center'}}>
              <div className='text-content'>
                <div className="device-item-text" style={{marginTop:'0px'}}><b>Khu vực:</b> {e.name}</div>
                <div className='device-item-text'><b>ID:</b> {e.locationID}</div>
                <div className='device-item-text'><b>Vai trò:</b> {e.role}</div>
              </div>
              <Dropdown
                menu={{
                  items:itemss(e),
                }}
                trigger={['click']}
                placement="bottomRight"
                
              >
                <a onClick={StopPropagation} style={{height:'30px', width:'30px'}}>
                  <div className='more_' ><MoreOutlined /></div>
                </a>
              </Dropdown>
            </div>
          )}
        </div> :
        <div className='no-data'>Danh sách trống</div>
      }
      <Modal
        title="Tạo mới khu vực"
        open={isShowAddModal} 
        onOk={createLocal} 
        onCancel={()=>setShowAddModal(false)} 
        okText="Xác nhận" 
        cancelText="Hủy"
        destroyOnClose
      >
        <div id='update-name-box' className="update-name-box">
          <Input id='new-location-name' placeholder='Nhập tên khu vực'/>
        </div>
      </Modal>
      <Modal
        title="Gia nhập khu vực"
        open={isShowJoinModal} 
        onOk={joinLocal} 
        onCancel={()=>setShowJoinModal(false)} 
        okText="Gửi" 
        cancelText="Hủy"
        destroyOnClose
      >
        <div id='update-name-box' className="update-name-box">
          <Input id='join-location-id' placeholder='Nhập mã khu vực'/>
        </div>
      </Modal>
    </div>
  )
}

export default Location