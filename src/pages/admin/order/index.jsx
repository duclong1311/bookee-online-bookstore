import { Button, Result, Steps } from "antd";
import ViewOrder from "../../../components/order/ViewOrder";
import Payment from "../../../components/order/Payment";
import './order.scss';
import { useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const MangeOrderPage = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            {
                                title: 'Chi tiết đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 &&
                    <ViewOrder setCurrentStep={setCurrentStep} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} />
                }
                {currentStep === 2 &&
                    <Result
                        style={{ height: 'calc(100vh - 290px)' }}
                        icon={<SmileOutlined />}
                        title="Đơn hàng được đặt thành công!"
                        extra={<Button type="primary" onClick={() => navigate('/order-history')}>Xem lịch sử đặt hàng</Button>}
                    />
                }
            </div>
        </div>
    )
}

export default MangeOrderPage;
