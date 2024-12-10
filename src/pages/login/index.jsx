import { Button, Form, Input, Divider, message, notification } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import './index.scss';
import { callLogin } from '../../services/api';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password, 3000);
        setIsSubmit(false);
        if (res?.data?.access_token) {
            message.success('Đăng nhập thành công');
            dispatch(doLoginAction(res.data.user));
            localStorage.setItem('access_token', res.data.access_token);
            navigate('/')
        } else {
            notification.error({
                description: res?.message,
                message: 'Có lỗi xảy ra',
                showProgress: true,
            });
        }
    };

    const handleLogin3rdParty = (type) => {
        if (type === 'google') {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                }).catch((error) => {
                    console.log('Have error', error.message);
                });
        }
    }

    return (
        <>
            <div className="login-page">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                            <div className="heading">
                                <h2 className="text text-large">Đăng Nhập</h2>
                                <Divider />
                            </div>
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="username"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                // wrapperCol={{ offset: 6, span: 16 }}
                                >
                                    <Button type="primary" htmlType="submit" loading={isSubmit} size='large' style={{ width: '123.28px' }}>
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <Divider style={{ color: 'lightgray' }}>HOẶC</Divider>
                                {/* <div className='login-3rd-party' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button type="primary" icon={<FacebookOutlined />} size='large' onClick={() => handleLogin3rdParty('facebook')}>
                                        Facebook
                                    </Button>
                                    <Button type="primary" icon={<GoogleOutlined />} size='large' style={{ width: '123.28px' }} onClick={() => handleLogin3rdParty('google')}>
                                        Google
                                    </Button>
                                </div> */}
                                <p className="text text-normal">Chưa có tài khoản ?
                                    <span>
                                        <Link to='/register' > Đăng Ký </Link>
                                    </span>
                                </p>
                                <br />
                                <p className="text" style={{ color: "#9d9d9d" }}>
                                    p/s: Để test, sử dụng tài khoản admin@gmail.com/password: 123456
                                </p>
                            </Form>
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

export default LoginPage;