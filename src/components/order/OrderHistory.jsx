import { Badge, Descriptions, Divider, Space, Table, Tag } from "antd";
import { Children, useEffect, useState } from "react";
import { getOrderHistory } from "../../services/api";
import { formatDate } from "../../services/formatDate";
import './OrderHistory.scss';

const OrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsTableLoading(true);
            const res = await getOrderHistory();
            if (res && res.data) {
                setOrderHistory(res.data);
            }
            setIsTableLoading(false);
        }

        fetchHistory();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => (<>{index + 1}</>),
            width: '5%'
        },
        {
            title: 'Thời gian ',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return formatDate(item)
            },
            width: '10%'
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item)
            },
            width: '10%'
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, { tags }) => (
                <Tag color={"green"}>
                    Thành công
                </Tag>
            ),
            width: '10%'
        },
        {
            title: 'Chi tiết đơn hàng',
            dataIndex: 'detail',
            key: 'detail',
            render: (details) => {
                return (
                    <div style={{ width: '100%', height: '100%' }}>
                        <Table
                            style={{ margin: '-16px' }}
                            bordered={false}
                            dataSource={details.map((detail, index) => ({
                                ...detail,
                                key: detail._id,
                                index: index + 1,
                            }))}
                            columns={[
                                {
                                    title: 'STT',
                                    dataIndex: 'index',
                                    key: 'index',
                                    width: '10%',
                                },
                                {
                                    title: 'Tên sách',
                                    dataIndex: 'bookName',
                                    key: 'bookName',
                                    width: '50%',
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    width: '20%',
                                },
                                {
                                    title: 'Thành tiền',
                                    render: (record) => {
                                        const pricePerBook = 100000; 
                                        return new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(record.quantity * pricePerBook);
                                    },
                                    key: 'priceTotal',
                                    width: '20%',
                                },
                            ]}
                            pagination={false}
                        />
                    </div>
                );
            },
            width: 'auto',
        },
    ];

    return (
        <div className="history-container" style={{ height: 'calc(100vh - 190px)' }}>
            <div className="history-table">
                <Table
                    columns={columns}
                    dataSource={orderHistory}
                    bordered={true}
                    loading={isTableLoading}
                    pagination={false}
                    scroll={{ y: 'calc(100vh - 300px)' }}
                />
            </div>
        </div>
    )
}

export default OrderHistory;