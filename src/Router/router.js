import DeviceDetail from '../Pages/DeviceDetail/DeviceDetail'
import Home from '../Pages/Home/Home'
import ListDevice from '../Pages/Home/ListDevice'
import UpdateInfo from '../Pages/UpdateInfo/UpdateInfo'
import ChangePassword from '../Pages/UpdateInfo/ChangePassword'
import Trash from '../Pages/Home/Trash'
import Statistics from '../Pages/Home/Statistics'
import Statistic from '../Pages/DeviceDetail/Statistic'

export const PUBLIC_ROUTER = [
  {
    key: "home",
    path: '/',
    element: <Home/>,
  },
  {
    key: "list-device",
    path: '/list-device',
    element: <ListDevice/>,
  },
  {
    key: "trash",
    path: '/trash',
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