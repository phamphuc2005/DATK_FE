import { useEffect, useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

import "./LoginSignUp.css";
import { postRequest } from "../../hooks/api";
import ErrorMessage from "../../Component/ErrorMessage/ErrorMessage";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [ errorMessage, setErrorMesssage ] = useState(null);

  useEffect(() => {
    if(localStorage.getItem('accessToken'))
      navigate('/');
  });

  const handleLogin = async () => {
    const { email, password } = form.getFieldValue();
    const data = await postRequest('/login', {
      email,
      password
    });
    const error = await data.message;
    if (error) {
      // setErrorMesssage(error);
      toast.error(error)
    }
    else {
      localStorage.setItem('accessToken', await data.accessToken);
      navigate('/');
    }
  };

  return (
    <>
      <div className="space"></div>
      <div className="white-box-page">
        <div className="box-title">Đăng nhập</div>
        <p className="box-text">
          Hãy nhập email và mật khẩu để đăng nhập vào tài khoản của bạn
        </p>
        <Form form={form} layout="vertical" style={{marginTop:'10px'}}>
          <Form.Item
            // label='Tên đăng nhập:'
            name="email"
            rules={[{ required: true, message: "Cần nhập email!" }]}
          >
            <Input className="box-input" placeholder="Email" />
          </Form.Item>
          <Form.Item
            // label='Mật khẩu:'
            name="password"
            rules={[{ required: true, message: "Cần nhập mật khẩu!" }]}
          >
            <Input.Password
              className="box-input"
              placeholder="Mật khẩu"
            
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="box-button"
              type="primary"
              onClick={handleLogin}
              htmlType="submit"
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <p className="box-text" style={{marginTop:'10px'}}>
          <div style={{marginBottom:'10px'}}>
            Bạn chưa có tài khoản?&nbsp;
            <a style={{ textDecoration: "underline"}} href="/signup">
              Đăng kí ngay
            </a>
          </div>
          <div>
            Bạn quên mật khẩu?&nbsp;
            <a style={{ textDecoration: "underline"}} href="/forget">
              Lấy lại mật khẩu
            </a>
          </div>
        </p>
      </div>
      <ErrorMessage 
        errorMessage={errorMessage} 
        setErrorMesssage={setErrorMesssage}
      />
    </>
  );
}

export default Login;
