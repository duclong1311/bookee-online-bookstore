import { Divider, Badge, Dropdown, message, notification, Avatar, Popover, Empty } from 'antd';
import { TiTick } from "react-icons/ti";
import { FaCarSide } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { FaShippingFast } from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import { IoLogoReact } from "react-icons/io5";
import { SlMagnifier } from "react-icons/sl";
import { IoCartOutline } from "react-icons/io5";
import './header.scss';
import { callLogout } from '../../services/api';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ManageAccount from '../account/ManageAccount';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Header = (props) => {

    const navigate = useNavigate();
    const isLogin = useSelector(state => state.account.isAuthenticated);
    const dispatch = useDispatch();
    const carts = useSelector(state => state.order.carts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userInfo = useSelector(state => state.account.user);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res?.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/');
        } else {
            notification.error({
                description: 'Lỗi không xác định, bạn chưa thể đăng xuất!',
                message: 'Có lỗi xảy ra',
                showProgress: true,
            });
        }
    }

    let items = [
        {
            key: 'adminPage',
            label: <Link to="/admin" >Trang quản trị</Link>,
            disabled: userInfo?.role === 'USER' ? true : false,
        },
        {
            label: <Link to="/order-history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            key: 'account',
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            onClick: () => setIsModalOpen(true)
        },
        {
            key: 'logout',
            danger: true,
            label: <label>Đăng xuất</label>,
            onClick: handleLogout,
        },

    ];

    return (
        <>
            <div className="header-container">
                <div className="header-top">
                    <div className="header-top__logo">
                        <IoLogoReact
                            onClick={() => navigate('/')}
                            className="header-logo"
                        />
                    </div>
                    <div className="header-top__search">
                        <SlMagnifier style={{ color: '#ccc', paddingRight: '5px', fontSize: '24px' }} />
                        <input type="text" className="header-top__search-input" placeholder="Giá siêu rẻ" onChange={(e) => props.setSearchTerm(e.target.value)} />
                        <Divider type="vertical" />
                        <button className="header-top__search-button">Tìm kiếm</button>
                    </div>
                    <div className='header-top__right'>
                        <div className="header-top__account" style={{ cursor: 'pointer' }}>
                            {isLogin ?
                                <>
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        src={`${baseUrl}/images/avatar/${userInfo?.avatar}`}
                                        style={{ fontSize: "32px", marginLeft: '5px', cursor: 'context-menu' }}
                                    />
                                    <Dropdown menu={{ items }} trigger={['click']} style={{ cursor: 'pointer' }}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            {`${userInfo?.fullName}`}
                                        </a>
                                    </Dropdown>
                                </>
                                :
                                <span onClick={() => navigate('/login')}>
                                    <UserOutlined style={{ fontSize: "32px", marginRight: '5px', cursor: 'pointer' }} />
                                    Tài khoản
                                </span>
                            }
                        </div>
                        <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                        <div className="header-top__cart" onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                            <Popover
                                className='popover-carts'
                                rootClassName='popover-carts'
                                placement="bottom"
                                title={'Sản phẩm đã thêm'}
                                content={carts.length > 0 ?
                                    () => (
                                        <>
                                            <div className='pop-cart-body'>
                                                <div className='pop-cart-content'>
                                                    {carts?.map((book, index) => {
                                                        return (
                                                            <div className='book' key={`book-${index}`}>
                                                                <img src={`${baseUrl}/images/book/${book?.detail?.thumbnail}`} />
                                                                <div className='title'>{book?.detail?.mainText}</div>
                                                                <div className='price'>
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className='pop-cart-footer'>
                                                    <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    :
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'Không có sản phẩm nào'} />
                                }
                            >
                                <Badge count={carts?.length ?? 0} overflowCount={10} showZero>
                                    <IoCartOutline style={{ fontSize: "32px", color: 'rgb(11, 116, 229)' }} />
                                </Badge>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="header-bottom">
                    Cam kết
                    <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                    <div className='header-bottom__commit'>
                        <TiTick style={{ fontSize: "24px", color: 'rgb(11, 116, 229)', cursor: 'default' }} />
                        <a>100% hàng thật</a>
                    </div>
                    <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                    <div className='header-bottom__commit'>
                        <FaCarSide style={{ fontSize: "24px", color: 'rgb(11, 116, 229)' }} />
                        <span>Freeship mọi đơn</span>
                    </div>
                    <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                    <div className='header-bottom__commit'>
                        <MdCurrencyExchange style={{ fontSize: "24px", color: 'rgb(11, 116, 229)' }} />
                        <span>Hoàn 200% nếu hàng giả</span>
                    </div>
                    <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                    <div className='header-bottom__commit'>
                        <FaBox style={{ fontSize: "24px", color: 'rgb(11, 116, 229)' }} />
                        <span>30 ngày đổi trả</span>
                    </div>
                    <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                    <div className='header-bottom__commit'>
                        <FaShippingFast style={{ fontSize: "24px", color: 'rgb(11, 116, 229)' }} />
                        <span>Giao nhanh 2h</span>
                    </div>
                    <Divider type="vertical" style={{ borderLeft: '2px solid #ccc', height: '28px' }} />
                    <div className='header-bottom__commit'>
                        <FaTags style={{ fontSize: "24px", color: 'rgb(11, 116, 229)' }} />
                        <span>Giá siêu rẻ</span>
                    </div>
                </div>
            </div>
            <ManageAccount
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    )
}

export default Header;