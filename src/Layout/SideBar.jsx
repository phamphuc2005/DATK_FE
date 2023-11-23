import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getRequest } from "../hooks/api";
import { EditOutlined, LogoutOutlined, UserOutlined, MailOutlined, PhoneOutlined, ApartmentOutlined, MenuOutlined, HomeOutlined, DatabaseOutlined, DeleteOutlined, SyncOutlined, BarChartOutlined, IdcardOutlined, FundViewOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { Dropdown } from "antd";

export default function SideBar() {
  const [ customerInfo, setCustomerInfo ] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    GetCustomerInfo();
  }, [location]);

  const GetCustomerInfo = async () => {
    const data = await getRequest('/user');
    setCustomerInfo(await data);
    // localStorage.setItem('username', await data.username);
    localStorage.setItem('name', await data.name);
    localStorage.setItem('email', await data.email);
    localStorage.setItem('phone', await data.phone);
    localStorage.setItem('user_id', await data._id);
  }

  const Logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  }

  const Home = () => {
    navigate('/')
  }

  const items = [
    {
      label: <a onClick={()=>(navigate('/'))}><HomeOutlined /> Trang chủ</a>,
    },
    {
      label: <a onClick={()=>(navigate('/update-info'))}><UserOutlined /> Thông tin tài khoản</a>,
    },
    {
      label: <a onClick={()=>(navigate('/change-password'))}><SyncOutlined /> Đổi mật khẩu</a>,
    },
    {
      label: <a onClick={()=>(navigate('/location'))}><EnvironmentOutlined /> Quản lý khu vực</a>,
    },
    {
      label: <a onClick={()=>(navigate('/list-device'))}><FundViewOutlined /> Thông số thiết bị</a>,
    },
    {
      label: <a onClick={()=>(navigate('/statistics'))}><BarChartOutlined /> Thống kê số liệu</a>,
    },
    // {
    //   label: <a onClick={()=>(navigate('/trash'))}><DeleteOutlined /> Thùng rác</a>,
    // },
    {
      label: <a onClick={Logout}><LogoutOutlined /> Đăng xuất</a>,
    },
  ];

  return(
    <div className='customer-info-box'>
      <div className="customer-name-box">
          <div >
            <img src='/Image/fire_alarm_logo.png' alt='' onClick={Home}/>
          </div>
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <a onClick={(e) => e.preventDefault()}>
            <div className="drop-menu"><MenuOutlined /></div>
        </a>
      </Dropdown>
        {/* <div className="customer-name">
          <h1>{customerInfo.name}</h1>
          <p>ID: {customerInfo._id}</p>
        </div> */}
      </div>
      <div className='customer-info'>
        <p><b><UserOutlined style={{color:'blue'}}/> <h style={{color:'blue'}}>:</h> {customerInfo.name} </b></p>
        <p><b><IdcardOutlined style={{color:'blue'}}/> <h style={{color:'blue'}}>:</h> {customerInfo._id} </b></p>
        <p><b><MailOutlined style={{color:'blue'}}/> <h style={{color:'blue'}}>:</h> {customerInfo.email} </b></p>
        <p><b><PhoneOutlined style={{color:'blue'}}/> <h style={{color:'blue'}}>:</h> {customerInfo.phone} </b></p>
      </div>
      <div className='customer-info-button'>
          {/* <a href='/add-device' className='add-device'>Thêm thiết bị</a> */}
          {/* <a href='/update-info' className='update-info'><EditOutlined />  Sửa thông tin</a> */}
          <button onClick={Logout}><LogoutOutlined /> Đăng xuất</button>
        </div>
    </div>
  )
}