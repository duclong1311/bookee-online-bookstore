import { DeleteTwoTone } from "@ant-design/icons";
import { Col, Divider, InputNumber, message, notification, Radio, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { totalPrice } from "../../services/totalPrice";
import { createOrder } from "../../services/api";
import { doClearCartAction } from "../../redux/order/orderSlice";
import { useState } from "react";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Payment = (props) => {
    const { setCurrentStep } = props;

    const carts = useSelector((state) => state.order.carts);
    const userInfo = useSelector((state) => state.account.user);
    const dispatch = useDispatch();

    const [address, setAddress] = useState('');

    const handlePlaceOrder = async () => {
        try {
            const data = {
                name: userInfo?.fullName,
                address: address,
                phone: userInfo?.phone,
                totalPrice: totalPrice(carts),
                detail: carts.map(({ detail, quantity, _id }) => ({
                    bookName: detail?.mainText,
                    quantity,
                    _id
                }))
            };

            const res = await createOrder(data);

            if (res?.error) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message || 'Vui lòng thử lại.'
                });
            } else {
                message.success('Đặt hàng thành công!');
                setCurrentStep(2);
                dispatch(doClearCartAction());
            }
        } catch (error) {
            console.error("Error placing order:", error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
            });
        }
    };

    return (
        <Row gutter={[20, 20]} style={{ height: 'calc(100vh - 290px)' }}>
            <Col md={16} xs={24}>
                {carts && carts.length > 0 &&
                    carts.map((item, index) => (
                        <div className='order-book' key={`item-${index}`}>
                            <div className='book-content'>
                                <img src={`${baseUrl}/images/book/${item?.detail?.thumbnail}`} />
                                <div className='title'>
                                    {item?.detail?.mainText}
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.detail?.price)}
                                </div>
                            </div>
                            <div className='action'>
                                <div className='quantity'>
                                    <InputNumber value={item.quantity} disabled />
                                </div>
                                <div className='sum'>
                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.detail?.price * item.quantity)}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    twoToneColor="#eb2f96"
                                    disabled={true}
                                />
                            </div>
                        </div>
                    ))
                }
            </Col>
            <Col md={8} xs={24} >
                <div className='order-sum'>
                    <div className='info'>
                        <div className='method'>
                            <div>  Hình thức thanh toán</div>
                            <Radio checked>Thanh toán khi nhận hàng</Radio>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        <div className='address'>
                            <div> Địa chỉ cụ thể</div>
                            <TextArea
                                rows={4}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                            />
                        </div>
                    </div>
                    <div className='calculate'>
                        <span>Tạm tính</span>
                        <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice(carts) || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice(carts) || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button onClick={() => handlePlaceOrder()}>Đặt Hàng ({carts?.length ?? 0})</button>
                </div>
            </Col>
        </Row>
    )
}

export default Payment;