import './Layout.css';
import SideBar from './SideBar';

function PublicLayout(props) {
  return (
    <div className='public-layout'>
      {/* <MainHeader /> */}
      <div className='sidebar-content'>
        <div className='sidebar-content-wrapper'>
          <SideBar />
          <div className='content'>
            {props.children}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default PublicLayout;