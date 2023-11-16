import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'antd/dist/reset.css';

import PublicLayout from './Layout/PublicLayout';
import NotFound from './Pages/NotFound';
import Login from './Pages/LoginSignUp/Login';
import { PUBLIC_ROUTER } from './Router/router';
import './App.css';
import SignUp from './Pages/LoginSignUp/SignUp';
import ForgetPassword from './Pages/LoginSignUp/ForgotPassword';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/forget' element={<ForgetPassword />}/>
        {/* <Route path='/change-password' element={<ChangePassword/>}/> */}
        {PUBLIC_ROUTER.map(e =>
          <Route 
            key={e.key}
            path={e.path}
            element={<PublicLayout>{e.element}</PublicLayout>}
          />
        )}
      </Routes>
      <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </BrowserRouter>
  );
}

export default App;
