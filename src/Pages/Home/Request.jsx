import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './Home.css';
import { getRequest, postRequest } from '../../hooks/api';
import { Breadcrumb, Button, Dropdown, Form, Input, Modal, Pagination } from 'antd';

import { toast } from 'react-toastify';

function Request() {
  const navigate = useNavigate();
  const [ requests, setRequests ] = useState([]);
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const elementsToDisplay = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
    else {
      GetRequests();
    }
  }, [navigate, location]);

  const GetRequests = async () => {
    const data = await getRequest('/list-request');
    setRequests(await data);
    console.log(await data);
  }
  
  const cancelRequest = async (locationID) => {
    Modal.confirm({
      title: `Hủy yêu cầu`,
      okText: 'Có',
      cancelText: 'Không',
      maskClosable: true,
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn hủy yêu cầu này không?`,
      async onOk() {
        const data = await postRequest('/cancel-request', {
          locationID: locationID,
          userID: localStorage.getItem('user_id') 
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          GetRequests();
        }
      },
    })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return(
    <div className="device-list page-component">
      <div style={{display:'flex', justifyContent:'space-between', paddingRight:'20px'}}>
        <Breadcrumb className='breadcrumb'>
          <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
          <Breadcrumb.Item><a onClick={()=>(navigate('/location'))}>Khu vực</a></Breadcrumb.Item>
          <Breadcrumb.Item className='current'>Danh sách yêu cầu</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <h1 className='component-title'>Danh sách yêu cầu</h1>
      {requests.length > 0 ?
        <>
          <div className='grid_container' style={{marginTop:'40px'}}>
            {elementsToDisplay.map((e, index) => 
              <div className="device_item" style={{alignItems:'center', cursor:'auto', marginBottom:'0'}}>
                <div className='text_content'>
                  <div className="device_item_text" style={{marginTop:'0px'}}><b>Khu vực:</b> {e.name}</div>
                  <div className='device_item_text'><b>ID:</b> {e.locationID}</div>
                  <div className='device_item_text'><b>Vai trò:</b> {e.role}</div>
                </div>
                <Button             
                  className='delete-button' 
                  type="primary" 
                  danger
                  onClick={()=>cancelRequest(e._id)}
                  >Hủy</Button>
              </div>
            )}
          </div> 
          <Pagination
            current={currentPage}
            // pageSize={pageSize}
            total={requests.length}
            onChange={handlePageChange}
            style={{textAlign:'center', marginTop:'20px'}}
          /> 
        </> :
        <div className='no_data'>Danh sách trống</div>
      }
    </div>
  )
}

export default Request