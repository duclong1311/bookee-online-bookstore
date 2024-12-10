import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button } from 'antd';
import { getListOrder } from '../../../services/api';
import { ReloadOutlined } from '@ant-design/icons';
import { formatDate } from '../../../services/formatDate';
import InputSearch from './InputSearch';

const MangeOrder = () => {
    const [listOrder, setListOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-createdAt");
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize, filter, sortQuery, searchQuery]);

    const fetchOrder = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        if (searchQuery) {
            query += `&${searchQuery}`;
        }

        const res = await getListOrder(query);
        if (res && res.data) {
            setListOrder(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        // setDataViewDetail(record);
                        // setOpenViewDetail(true);
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</>

                )
            },
            sorter: true
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{formatDate(record.updatedAt)}</>
                )
            }

        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };

    // change button color: https://ant.design/docs/react/customize-theme#customize-design-token
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Order</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button type='ghost' onClick={() => {
                        setFilter("");
                        setSortQuery("")
                    }}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }

    const searchFilter = (query) => {
        setSearchQuery(query)
    }

    return (
        <>
            <InputSearch searchFilter={searchFilter} />
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}

                        columns={columns}
                        dataSource={listOrder}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                            }
                        }
                    />
                </Col>
            </Row>
        </>
    )
}


export default MangeOrder;