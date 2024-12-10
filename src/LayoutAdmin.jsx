import React, { useEffect, useState } from 'react';
import {
    FileOutlined,
    PieChartOutlined,
    DownOutlined,
    UserOutlined,
    BookOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Dropdown, Space, message, notification, Avatar } from 'antd';
import { RiAdminLine } from "react-icons/ri";
import './layoutAdmin.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Footer from "./components/footer";
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from './services/api';
import { doLogoutAction } from './redux/account/accountSlice';
import ManageAccount from './components/account/ManageAccount';
const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { Outlet } from 'react-router';
import Footer from "./components/footer";
const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Dash Board', 'dashboard', <PieChartOutlined />),
    getItem('Mange User', 'manage-user', <UserOutlined />, [
        getItem('CRUD User', 'user'),
    ]),
    getItem('Mange Book', 'sub2', <BookOutlined />, [
        getItem('CRUD Book', 'book'),
    ]),
    getItem('Mange Order', '9', <FileOutlined />),
    getItem('Dash Board', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('Manage Users', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Manage Book', 'sub2', <BookOutlined />, [
        getItem('Team 1', '6'),
        getItem('Team 2', '8')
    ]),
    getItem('Manage Order', '9', <FileOutlined />),
    getItem('Mange Order', 'order', <FileOutlined />),
];

const LayoutAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfor = useSelector(state => state.account.user);

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [pageUrl, setPageUrl] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res?.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/login');
        } else {
            notification.error({
                description: 'Lỗi không xác định, bạn chưa thể đăng xuất!',
                message: 'Có lỗi xảy ra',
                showProgress: true,
            });
        }
    }

    const itemsDropdown = [
        {
            label: <label>Quản lý tài khoản</label>,
            key: 'account',
            onClick: () => setIsModalOpen(true)
        },
        {
            key: 'homepage',
            label: <Link to="/">Trang chủ</Link>,
        },
        {
            label: <label >Đăng xuất</label>,
            key: 'logout',
            onClick: handleLogout
        },
    ];

    return (
        <Layout
            className="layout-admin"
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" >
                    <RiAdminLine style={{ fontSize: '22px' }} />
                    <div>ADMIN</div>
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={pageUrl}
                    activeKey={activeMenu}
                    mode="inline"
                    items={items}
                    onSelect={({ key }) => { navigate(`/admin/${key}`); setPageUrl(key); }}
                />
            </Sider>
            <Layout >
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <div className='admin-header'>

                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']} className='admin-header__account'>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        src={`${baseUrl}/images/avatar/${userInfor?.avatar}`}
                                    />
                                    {userInfor?.fullName}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                        overflow: "auto"
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                        items={[
                            { title: 'Admin' },
                            { title: pageUrl },
                        ]}
                    />

                    <div
                        style={{
                            padding: 24,
                            minHeight: '88%',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer />
                <ManageAccount
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            </Layout>
        </Layout>
    );
};
export default LayoutAdmin;