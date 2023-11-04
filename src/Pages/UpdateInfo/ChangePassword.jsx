// css cho component này tại file UpdateInfo.css
// Các element thêm vào trong thẻ div.update-info
import './UpdateInfo.css';
import { Breadcrumb, Button, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { postRequest } from '../../hooks/api';
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";
import { toast } from 'react-toastify';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [ errorMessage, setErrorMesssage ] = useState(null);

  useEffect(() => {
    if(!localStorage.getItem('accessToken'))
      navigate('/');
  });

  const handleChangePassword = async (value) => {
    console.log({
      oldPassword: value.oldPassword,
      newPassword: value.newPassword,
      confirmPassword: value.confirmPassword
    });
 
    Modal.confirm({
      title: `Đổi mật khẩu`,
      okText: 'Có',
      cancelText: 'Không',
      // icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn đổi mật khẩu?`,
      maskClosable: 'true',
      async onOk() {
        const data = await postRequest('/change-password', {
          oldPassword: value.oldPassword,
          newPassword: value.newPassword
        });
        const error = await data.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          navigate('/update-info');
        }
      },
      // onCancel() {
      //   notification.info({
      //     message: `Notification`,
      //     description: `Cancel update account`,
      //     placement: `topRight`,
      //     duration: 1.5,
      //   })
      // },
    })
  };

  return (
    <>
      <div className="update-info page-component">
        <Breadcrumb className='breadcrumb'>
          <Breadcrumb.Item><a onClick={()=>(navigate('/'))}>Home</a></Breadcrumb.Item>
          <Breadcrumb.Item> <a onClick={()=>(navigate('/update-info'))}>Account</a></Breadcrumb.Item>
          <Breadcrumb.Item className='current'> Change Password</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="component-title">Đổi mật khẩu</h1>
        <p className="box-text">Hãy điền đầy đủ thông tin để đổi mật khẩu!</p>
        <Form className="form-change-info" form={form} onFinish={(value) => handleChangePassword(value)}>
          <h2>Mật khẩu cũ</h2>
          <Form.Item
            name="oldPassword"
            rules={[
              { required: true, message: "Cần nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu cần ít nhất 6 kí tự" },
              {
                pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                message: "Mật khẩu không chứa kí tự đặc biệt và dấu cách",
              },
            ]}
          >
            <Input.Password
              className="box-input"
              placeholder="Mật khẩu cũ"
              size="large"
            />
          </Form.Item>
          <h2>Mật khẩu mới</h2>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Cần nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu cần ít nhất 6 kí tự" },
              {
                pattern: new RegExp(/^[a-zA-Z0-9]*$/),
                message: "Mật khẩu không chứa kí tự đặc biệt và dấu cách",
              },
            ]}
          >
            <Input.Password
              className="box-input"
              placeholder="Mật khẩu mới"
              size="large"
              style={{ zIndex: 1 }}
            />
          </Form.Item>
          <h2>Xác nhận mật khẩu mới</h2>
          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Cần xác nhận lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  } else return Promise.reject("Mật khẩu xác nhận không khớp");
                },
              }),
            ]}
          >
            <Input.Password
              className="box-input"
              placeholder="Xác nhận mật khẩu mới"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button className="box-button" htmlType="submit" type="primary">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />
    </>
  );
}