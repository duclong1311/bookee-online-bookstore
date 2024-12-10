import { DeleteTwoTone } from "@ant-design/icons";
import { Col, Divider, Empty, InputNumber, Row } from "antd";
import './ViewOrder.scss'
import { useDispatch, useSelector } from "react-redux";
import { doDeleteBookAction, doUpdateCartAction } from "../../redux/order/orderSlice";
import { useState } from "react";
import { totalPrice } from "../../services/totalPrice";
import { useNavigate } from "react-router";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ViewOrder = (props) => {
    const { setCurrentStep } = props;

    const dispatch = useDispatch();
    const carts = useSelector((state) => state.order.carts);
    const navigate = useNavigate();

    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({
                _id: book._id,
                quantity: value,
                detail: book.detail
            }));
        }
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0", height: 'calc(100vh - 290px)' }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {carts.length > 0 ?
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
                                            <InputNumber value={item.quantity} onChange={(value) => handleOnChangeInput(value, item)} />
                                        </div>
                                        <div className='sum'>
                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.detail?.price * item.quantity)}
                                        </div>
                                        <DeleteTwoTone
                                            onClick={() => dispatch(doDeleteBookAction({ _id: item._id }))}
                                            style={{ cursor: "pointer" }}
                                            twoToneColor="#eb2f96"
                                        />
                                    </div>
                                </div>
                            ))
                            :
                            <div className='order-book-empty'>
                                <Empty
                                    description={"Không có sản phẩm trong giỏ hàng"}
                                />
                            </div>
                        }
                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
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
                            {carts?.length === 0 ?
                                <button
                                    onClick={() => navigate('/')}
                                >
                                    Tiếp tục mua sắm
                                </button>
                                :
                                <button
                                    onClick={() => setCurrentStep(1)}
                                >
                                    Mua Hàng
                                </button>
                            }

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ViewOrder;
