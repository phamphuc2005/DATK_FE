// css cho component này tại file UpdateInfo.css
// Các element thêm vào trong thẻ div.update-info
import './UpdateInfo.css';
import { Breadcrumb, Button, Form, Input, Modal, notification } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { postRequest } from '../../hooks/api';
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";
import { toast } from 'react-toastify';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function UpdateInfo() {
  const [ form ] = Form.useForm();
  const navigate = useNavigate();
  const [ errorMessage, setErrorMesssage ] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [navigate, location]);

  const handleChange = async (value) => {
    console.log({
      name: value.customerName,
      email: value.email,
      phone: value.phone
    });

    Modal.confirm({
      title: `Chỉnh sửa thông tin `,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn chỉnh sửa thông tin? Hãy xác nhận!`,
      async onOk() {
        const data = await postRequest('/update-profile', {
          name: value.customerName,
          email: value.email,
          phone: value.phone
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          // window.location.reload();
          navigate('/update-info');
        }

      },
      // onCancel() {
      //   notification.error({
      //     message: `Notification`,
      //     // description: `Cancel update account`,
      //     placement: `top`,
      //     duration: 100,
      //     style: {border: '5px solid red', color: 'red'},
      //   })
      // },
    })
  }

  return (
    <>
      <div className="update-info page-component">
        <Breadcrumb className='breadcrumb'>
          <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Trang chủ</a></Breadcrumb.Item>
          <Breadcrumb.Item className='current'> Thông tin tài khoản</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="component-title">Thông tin tài khoản</h1>
        <Form
          className="form-change-info"
          form={form}
          onFinish={(value) => handleChange(value)}
        >
          <h2>Họ và tên</h2>
          <Form.Item
            name="customerName"
            initialValue={localStorage.getItem('name')}
          >
            <Input className="box-input" size="large" />
          </Form.Item>
          <h2>Email</h2>
          <Form.Item
            name="email"
            initialValue={localStorage.getItem('email')}
            rules={[
              { required: true, message: "Cần nhập email!" },
              { type: "email", message: "Sai định dạng email" },
            ]}
          >
            <Input className="box-input" size="large" />
          </Form.Item>
          <h2>Số điện thoại</h2>
          <Form.Item
            name="phone"
            initialValue={localStorage.getItem('phone')}
            rules={[
              { required: true, message: "Cần nhập số điện thoại!" },
              {
                pattern: new RegExp('(84|0[3|5|7|8|9])+([0-9]{8})\\b'),
                message: "Số điện thoại không hợp lệ"
              },
            ]}
          >
            <Input className="box-input" size="large" />
          </Form.Item>
          <Button
            className='box-button'
            // htmlType='submit'
            type="primary" ghost
            onClick={()=>(navigate('/change-password'))}
          >
            Đổi mật khẩu
          </Button>
          <Button
            className='box-button'
            htmlType='submit'
            type='primary'
            style={{float:'right'}}
          >
            Chỉnh sửa
          </Button>
        </Form>
        {/* <p className='change-password'>
          Bạn muốn đổi mật khẩu?&nbsp;
          <a  onClick={()=>(navigate('/change-password'))}>Đổi mật khẩu</a>
        </p> */}
      </div>
      <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />
    </>
  );
}