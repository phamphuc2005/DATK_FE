import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Dropdown, Form, Input, Modal, Pagination, Select, Space } from 'antd';

import { PlusOutlined, DeleteFilled, MoreOutlined, SettingOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';

function Location() {
  const navigate = useNavigate();
  const [ locations, setLocations ] = useState([]);
  const [ location_, setLocation ] = useState({});
  const [ isShowAddModal, setShowAddModal ] = useState(false);
  const [ isShowJoinModal, setShowJoinModal ] = useState(false);
  const [ isShowUpdateModal, setShowUpdateModal ] = useState(false);
  const location = useLocation();
  const [ isRole, setIsRole ] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const elementsToDisplay = locations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetLocations();
    }
  }, [navigate, location, isRole]);

  const GetLocations = async () => {
    const data = await getRequest(`/list-location/${isRole}`);
    setLocations(await data);
    console.log(await data);
  }
  
  const showAddModal = () => {
    setShowAddModal(true);
  }

  const showJoinModal = () => {
    setShowJoinModal(true);
  }

  const showUpdateModal = (e) => {
    setShowUpdateModal(true);
    setLocation(e)
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
    (e.role === 'Admin' ?
    {
      label: <a onClick={()=>showUpdateModal(e)}>Đổi tên</a>,
    } : ''
    ),
    (e.role === 'Admin' ?
    {
      label: <a onClick={()=>deleteLocation(e)}>Xóa khu vực</a>,
    } : ''
    ),
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

  const updateLocation = async () => {
    const locationName = document.getElementById('update-name-location').value;
    if (locationName === '') { toast.warning('Cần nhập gồm ít nhất 1 kí tự!'); }
    else {
      const data = await await postRequest('/update-location', {
        name: locationName,
        userID: localStorage.getItem('user_id'),
        _id: location_._id
      });

      const error = await data.message;
      if (error) {
        toast.error(error);
        setShowUpdateModal(false);
      }
      else {
        toast.success('Thành công!');
        setShowUpdateModal(false);
        GetLocations();
      }
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (key) => {
    setIsRole(key)
  };

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
      <div style={{display:'flex', margin:'40px 20px 0 20px', gap:'5px', alignItems:'baseline'}}>
        <div style={{fontWeight:'500'}}>Vai trò :</div>
        <Space wrap>
          <Select
            defaultValue="All"
            style={{
              width: 100,
            }}
            onChange={handleChange}
            size='middle'
            options={[
              {value: 'All', label: 'Tất cả'},
              {value: 'Admin', label: 'Admin'},
              {value: 'Member', label: 'Member'}
            ]}
          >
          </Select>
        </Space>
      </div>
      {locations.length > 0 ?
        <>
          <div className='grid-container' style={{marginTop:'20px'}}>
            {elementsToDisplay.map((e, index) => 
              // <DeviceItem
              //   key={index}
              //   id={e._id}YYYYYY
              //   deviceID={e.deviceID}
              //   name={e.name}
              //   state={e.state}
              // />
              <div className="device_item" style={{alignItems:'center', cursor:'auto'}}>
                <div className='text_content'>
                  <div className="device_item_text" style={{marginTop:'0px'}}><b>Khu vực:</b> {e.name}</div>
                  <div className='device_item_text'><b>ID:</b> {e.locationID}</div>
                  <div className='device_item_text'><b>Vai trò:</b> {e.role}</div>
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
          </div>
          <Pagination
            current={currentPage}
            // pageSize={pageSize}
            total={locations.length}
            onChange={handlePageChange}
            style={{textAlign:'center', marginTop:'20px'}}
          />  
        </> :
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
      <Modal
        title="Đổi tên khu vực"
        open={isShowUpdateModal} 
        onOk={updateLocation} 
        onCancel={()=>setShowUpdateModal(false)} 
        okText="Gửi" 
        cancelText="Hủy"
        destroyOnClose
      >
        <div id='update-name-box' className="update-name-box">
          <Input id='update-name-location' placeholder='Nhập tên mới'/>
        </div>
      </Modal>
    </div>
  )
}

export default Location