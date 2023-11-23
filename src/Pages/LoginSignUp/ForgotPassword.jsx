// import styled from "styled-components"
import { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";

import "./LoginSignUp.css";
import { postRequest } from "../../hooks/api";
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [ errorMessage, setErrorMesssage ] = useState(null);
  const [ data, setData ] = useState({});
  const [ isShowModal, setIsShowModal ] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('accessToken'))
      navigate('/');
  });

  const handleForget = async () => {
    const { password, email } = form.getFieldValue();
    
    let data = await postRequest('/forget-password', {
      newPassword: password,
      email,
    });

    const error = await data.message;
    if (error) {
      toast.error(error);
    }
    else {
      setData(data)
      setIsShowModal(true)
    }
  };

  const ConfirmCode = async () => {
    const code = document.getElementById('code').value;
    if (code === '') { toast.warning('Cần nhập mã xác nhận!'); }
    else {
      let confirmCode = await postRequest('/confirm-code', {
        code: code,
        email: data.email,
        newPassword: data.newPassword
      })
      const error = await confirmCode.message;
        if (error) {
          toast.error(error);
        }
        else {
          toast.success('Thành công!');
          navigate('/login');
        }
    }
  }

  const CloseModal = () => {
    setIsShowModal(false)
  }

  return (
    <>
      <div className="space"></div>
      <div style={{textAlign:'center', color:'gold', fontSize:'32px', fontWeight:'900'}}>FIRE ALARM SYSTEM</div>
      <div className="white-box-page">
        <div className="box-title">Lấy lại mật khẩu</div>
        <p className="box-text" style={{marginBottom:'30px'}}>
          Hãy nhập email và mật khẩu mới để lấy lại mật khẩu
        </p>
        <Form form={form} onFinish={handleForget}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Cần nhập email!" },
              { type: "email", message: "Sai định dạng email" },
            ]}
          >
            <Input className="box-input" placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Cần nhập mật khẩu mới!" },
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
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Cần xác nhận lại mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
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
            {/* <p style={{margin: '0'}}>Abc</p> */}
          </Form.Item>

          <Form.Item>
            <Button
              className="box-button"
              type="primary"
              htmlType="submit"
              size="large"
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />

      <Modal
        title="Mã xác nhận"
        open={isShowModal} 
        onOk={ConfirmCode} 
        onCancel={CloseModal} 
        okText="Xác nhận" 
        cancelText="Hủy"
        destroyOnClose
      >
        <div id='update-name-box' className="update-name-box">
          <p style={{color:'red', fontStyle:'italic'}}>*Vui lòng truy cập email để lấy mã xác nhận!</p>
          <Input id='code' placeholder='Nhập mã xác nhận'/>
        </div>
      </Modal>
    </>
  );
}

export default ForgotPassword;
