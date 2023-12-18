import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getRequest, postRequest } from "../hooks/api";
import { EditOutlined, LogoutOutlined, UserOutlined, MailOutlined, PhoneOutlined, ApartmentOutlined, MenuOutlined, HomeOutlined, DatabaseOutlined, DeleteOutlined, SyncOutlined, BarChartOutlined, IdcardOutlined, FundViewOutlined, EnvironmentOutlined, BellOutlined, BorderTopOutlined } from '@ant-design/icons'
import { Badge, Drawer, Dropdown, notification } from "antd";
import './Notice.css';
import { async } from "q";
import { toast } from "react-toastify";
import moment from "moment";

export default function SideBar() {
  const [api, contextHolder] = notification.useNotification();
  const [ customerInfo, setCustomerInfo ] = useState({});
  const [ counts, setCount ] = useState(0);
  const [ notice, setNotice ] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('left');

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

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

  useEffect(() => {
    allNotice();
    setInterval(()=>{
      allNotice();
    }, 15000)
  }, [location]);

  const allNotice = async () => {
    const data = await getRequest('/list-notice');
    if (data.error) {
      toast.error(data.error)
    } else {
      setNotice(data)
      let i = 0;
      data.length > 0 && data.forEach(data => {
        if (data.state === 0) {
          i++;
        }
      });
      setCount(i);
    }
  }

  const Logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  }

  const Home = () => {
    navigate('/')
  }

  const readNotice = async (e) => {
    openNotification(e, 'topRight');
    const data = await postRequest('/read-notice', {
      _id: e._id,
      userID: localStorage.getItem('user_id')
    });
    const error = await data.message;
    if (error) {
      toast.error(error);
      allNotice();
    }
    else {
      allNotice();
    }
  }

  const deleteNotice = async (e, event) => {
    event.stopPropagation();
    const data = await postRequest('/delete-notice', {
      _id: e._id,
      userID: localStorage.getItem('user_id')
    });
    const error = await data.message;
    if (error) {
      toast.error(error);
      allNotice();
    }
    else {
      allNotice();
    }
  }

  const openNotification = (e, placement) => {
    api.warning({
      message: `Cảnh báo`,
      description:
        `${e.content}`,
      placement,
    });
  };

  const items = [
    {
      label: 'Menu',
      type: 'group',
      children: [
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
      ]
    }
  ];

  const formattedTime = (e) => {
    return moment(e).format("HH:mm:ss, DD/MM/YYYY");
  } 

  return(
    <div className='customer-info-box'>
      {contextHolder}
      <div className="customer-name-box">
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          // placement="bottomRight"
        >
          <a onClick={(e) => e.preventDefault()} title="Menu">
              <div className="drop-menu"><MenuOutlined /></div>
          </a>
        </Dropdown>
        <div >
          <img src='/Image/fire_alarm_logo.png' alt='' onClick={Home}/>
        </div>
        <Badge count={counts} offset={[-10, 10]}>
          <div className="drop-menu" onClick={showDrawer} title="Thông báo">
            <BellOutlined />
          </div>
        </Badge>

        {/* <div className="customer-name">
          <h1>{customerInfo.name}</h1>
          <p>ID: {customerInfo._id}</p>
        </div> */}
      </div>
      <div className='customer-info'>
        <p><b><UserOutlined style={{color:'blue'}}/> <span style={{color:'blue'}}>:</span> {customerInfo.name} </b></p>
        <p><b><IdcardOutlined style={{color:'blue'}}/> <span style={{color:'blue'}}>:</span> {customerInfo._id} </b></p>
        <p><b><MailOutlined style={{color:'blue'}}/> <span style={{color:'blue'}}>:</span> {customerInfo.email} </b></p>
        <p><b><PhoneOutlined style={{color:'blue'}}/> <span style={{color:'blue'}}>:</span> {customerInfo.phone} </b></p>
      </div>
      <div className='customer-info-button'>
          {/* <a href='/add-device' className='add-device'>Thêm thiết bị</a> */}
          {/* <a href='/update-info' className='update-info'><EditOutlined />  Sửa thông tin</a> */}
          <button onClick={Logout}><LogoutOutlined /> Đăng xuất</button>
      </div>

      <Drawer
        title="Thông báo"
        placement={placement}
        onClose={onClose}
        open={open}
        key={placement}
        maskClosable={true}
        mask={false}
        width={'396px'}
      >
        <div className="notices">
        {notice.length > 0 && notice.map((e, index) => 
          <div>
            {e.state === 0 ?
            <Badge dot>
              <div className="notice" style={{fontWeight:'bolder'}} onClick={()=>readNotice(e)}>
                <div>
                  <div style={{borderBottom:'1px solid #eee', paddingBottom:'5px'}}>{e.content}</div>
                  <div style={{marginTop:'5px', fontSize:'10px'}}>{formattedTime(e.createdAt)}</div>
                </div>
                <div className="delete-notice" onClick={(event)=>deleteNotice(e,event)} title="Xóa"><DeleteOutlined /></div>
              </div>
            </Badge> :
              <div className="notice" onClick={() => openNotification(e, 'topRight')}>
                <div>
                  <div style={{borderBottom:'1px solid #eee', paddingBottom:'5px'}}>{e.content}</div>
                  <div style={{marginTop:'5px', fontSize:'10px'}}>{formattedTime(e.createdAt)}</div>
                </div>
                <div className="delete-notice" onClick={(event)=>deleteNotice(e,event)} title="Xóa"><DeleteOutlined /></div>
            </div>
            }
          </div>
        )}
        </div>
      </Drawer>
    </div>
  )
}