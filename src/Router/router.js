import DeviceDetail from '../Pages/DeviceDetail/DeviceDetail'
import Home from '../Pages/Home/Home'
import ListDevice from '../Pages/Home/ListDevice'
import UpdateInfo from '../Pages/UpdateInfo/UpdateInfo'
import ChangePassword from '../Pages/UpdateInfo/ChangePassword'
import Trash from '../Pages/Home/Trash'
import Statistics from '../Pages/Home/Statistics'
import Statistic from '../Pages/DeviceDetail/Statistic'
import Location from '../Pages/Home/Location'
import Request from '../Pages/Home/Request'
import DeviceLocation from '../Pages/DeviceDetail/DeviceLocation'
import MemberLocation from '../Pages/DeviceDetail/MemberLocation'

export const PUBLIC_ROUTER = [
  {
    key: "home",
    path: '/',
    element: <Home/>,
  },
  {
    key: "location",
    path: '/location',
    element: <Location/>,
  },
  {
    key: "request",
    path: '/request',
    element: <Request/>,
  },
  {
    key: "member_location",
    path: '/member_location/:id',
    element: <MemberLocation/>,
  },
  {
    key: "device_location",
    path: '/device_location/:id',
    element: <DeviceLocation/>,
  },
  {
    key: "list-device",
    path: '/list-device',
    element: <ListDevice/>,
  },
  {
    key: "trash",
    path: '/trash/:id',
    element: <Trash/>,
  },
  {
    key: "statistics",
    path: '/statistics',
    element: <Statistics/>,
  },
  {
    key: 'update-info',
    path: '/update-info',
    element: <UpdateInfo />,
  },
  {
    key: 'change-password',
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    key: 'detail',
    path: '/detail/:id',
    element: <DeviceDetail />
  },
  {
    key: 'statistic',
    path: '/statistic/:id',
    element: <Statistic />
  }
]