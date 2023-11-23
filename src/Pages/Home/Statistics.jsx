import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import DeviceItem from '../../Component/DeviceItem/DeviceItem';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Form, Input, Modal, Pagination, Select, Space } from 'antd';

import { PlusOutlined, DeleteFilled } from '@ant-design/icons'
import { toast } from 'react-toastify';
import { Option } from 'antd/es/mentions';

function Statistics() {
  const navigate = useNavigate();
  const [ allSystems, setAllSystems ] = useState([]);
  const [ isShowModal, setShowModal ] = useState(false);
  const [ locations, setLocations ] = useState([]);
  const [ isLocation, setIsLocation ] = useState('All');
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const elementsToDisplay = allSystems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    const data = await getRequest('/list-location/All');
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

  const HandleViewDetail = (value) => {
    navigate(`/statistic/${value}`);
  }

  const handleChange = (key) => {
    setIsLocation(key)
  };

  const options = [{ value: 'All', label: 'Tất cả' },
  ...locations.map(location => (
    {value: location._id, label: `${location.name} - ${location.locationID}`}
  ))]

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return(
    <div className="device-list page-component">
      <Breadcrumb className='breadcrumb'>
        <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item className='current'>Thống kê số liệu</Breadcrumb.Item>
      </Breadcrumb>
      <h1 className='component-title'>Thống kê số liệu</h1>
      <div style={{display:'flex', margin:'40px 20px 0 20px', gap:'5px', alignItems:'baseline'}}>
        <div style={{fontWeight:'500'}}>Khu vực :</div>
        <Space wrap>
          <Select
            defaultValue="All"
            style={{
              width: 170,
            }}
            onChange={handleChange}
            size='middle'
            options={options}
          >
            {/* {locations.map(location => (
              <Option key={location._id} value={location._id}>
                {`${location.name} - ${location.locationID}`}
              </Option>
            ))} */}
          </Select>
        </Space>
      </div>
      {allSystems.length > 0 ?
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
              <div className="device-item" onClick={()=>HandleViewDetail(e.deviceID)}>
              <div className='text-content'>
                <div className="device-item-text" style={{marginTop:'0px'}}><b>ID:</b> {e.deviceID}</div>
                <div className='device-item-text'><b>Tên thiết bị:</b> {e.name}</div>
                <div className='device-item-text'><b>Khu vực:</b> {e.locationID.name} - {e.locationID.locationID}</div>
              </div>
            </div>
            )}
          </div> 
          <Pagination
            current={currentPage}
            // pageSize={pageSize}
            total={allSystems.length}
            onChange={handlePageChange}
            style={{textAlign:'center', marginTop:'20px'}}
          /> 
        </> :
        <div className='no-data'>Danh sách trống</div>
      }
    </div>
  )
}

export default Statistics