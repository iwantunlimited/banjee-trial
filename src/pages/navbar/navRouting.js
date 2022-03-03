import DashboardComp from "../Dashboard/dashboard";
import User from "../Users/Users";
import { Dashboard,PeopleAlt, AccountBox,ViewHeadline, Category as CategoryIcon } from '@mui/icons-material';
import Account from "../Account/Account";
import Category from "../Category/Category";
import Room from "../Rooms/Rooms";

const routing=[
    {
        id: 1,
        path: '/',
        name: 'Dashboard',
        icon: <Dashboard fontSize='medium' />,
        component: <DashboardComp />
    },
    {
        id: 2,
        path: '/category',
        name: 'Category',
        icon: <CategoryIcon fontSize='medium' />,
        component: <Category />
    },
    {
        id:3,
        path: '/user',
        name: 'Users',
        icon: <PeopleAlt fontSize="medium" />,
        component: <User />
    },
    {
        id:4,
        path: '/rooms',
        name: 'Rooms',
        icon: <ViewHeadline fontSize="medium" />,
        component: <Room />
    },
    // {
    //     id:3,
    //     path: '/account',
    //     name: 'Account',
    //     icon: <AccountBox fontSize={ window.innerWidth > 500 ? "large" : 'medium' } />,
    //     component: <Account />
    // }
]
export default routing;