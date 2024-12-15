import React, { useEffect, useState } from 'react';
import { Table, Space, Tag, Button, Popover, Popconfirm, message, notification } from 'antd';
import { deleteUser, getUsersWithPaginate } from '../../../services/api';
import { DeleteOutlined, DownloadOutlined, EditOutlined, ExportOutlined, EyeOutlined, ImportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import InputSearch from './InputSearch';
import UserViewDetail from './UserViewDetail';
import { formatDate } from '../../../services/formatDate';
import ModalCreateUser from './ModalCreateUser';
import ModalImport from './ModalImport';
import * as XLSX from 'xlsx';

const data = [
    {
        _id: '',
        fullName: '',
        email: '',
        phone: '',
        createAt: '',
        role: '',
    }
];

const UserTable = () => {
    const [totalData, setTotalData] = useState(1);
    const [listUser, setListUser] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openUserDetail, setOpenUserDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importData, setImportData] = useState([]);

    const fetchListUser = async () => {
        setIsLoading(true);

        let query = `current=${currentPage}&pageSize=${pageSize}`;
        if (searchQuery) {
            query += searchQuery;
        }
        console.log(searchQuery);

        const res = await getUsersWithPaginate(query);

        if (res && res.data && res.data.result.length > 0) {
            const listUserData = res.data.result;
            const metaData = res.data.meta;
            setListUser(listUserData);
            setTotalData(metaData.total);
        }
        setIsLoading(false);
    }


    useEffect(() => {
        fetchListUser();
    }, [currentPage, pageSize, searchQuery]);

    const onTableChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== currentPage) {
            setCurrentPage(pagination.current);
        }
    };

    const onSizeChange = (current, pageSize) => {
        setPageSize(pageSize);
        setCurrentPage(current);
    };

    const handleClickEdit = (userId) => {
        console.log('Edit', userId);
    }

    const handleClickDelete = async (userId) => {
        const res = await deleteUser(userId);
        if (res && res.data) {
            message.success('Xóa user thành công');
            setListUser((prev) => prev.filter((user) => user.id !== userId));
            setTotalData((prev) => prev - 1);
            fetchListUser();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }
    };


    const handleClickDetailUser = (record) => {
        setOpenUserDetail(true);
        setDataViewDetail(record);
    }

    const searchFilter = (query) => {
        setSearchQuery(query)
    }

    const exportFile = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ListUser.xlsx");
    }

    const renderHeader = () => {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '18px' }}>Danh sách người dùng</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button type="primary" shape="default" icon={<ImportOutlined />} onClick={() => setIsModalOpen('import')}>
                            Nhập file
                        </Button>
                        <Button type="primary" shape="default" icon={<ExportOutlined />} onClick={() => exportFile(listUser)}>
                            Xuất file
                        </Button>
                        <Button type="primary" shape="default" icon={<PlusOutlined />} onClick={() => setIsModalOpen('add')}>
                            Thêm mới
                        </Button>
                        <Button icon={<ReloadOutlined />} />
                    </div>
                </div>
            </>
        );
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            render: (_, record) => (
                <a onClick={() => handleClickDetailUser(record?._id)}>{record?._id}</a>
            ),
            width: '10%',
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.length - b.fullName.length,
            width: '20%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            filterSearch: true,
            sorter: (a, b) => a.email.length - b.email.length,
            width: '20%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            width: '10%',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (_, { createdAt }) => formatDate(createdAt),
            sorter: (a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateA - dateB;
            },
            width: '15%',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: (_, { role }) => {
                const color = role === 'ADMIN' ? 'geekblue' : 'green';
                {
                    return (
                        <Tag color={color} key={role}>
                            {role?.toUpperCase()}
                        </Tag>
                    );
                };
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" >
                    <Popconfirm
                        placement='leftTop'
                        title="Xác nhận xóa user"
                        description="Bạn có chắc chắn muốn xóa user này?"
                        onConfirm={() => handleClickDelete(record._id)}
                        onCancel={() => setPopoverOpen(false)}
                        okText='Xác nhận'
                        cancelText='Hủy'
                    >
                        <span>
                            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                        </span>
                    </Popconfirm>

                    <a onClick={() => handleClickEdit(record._id)}>
                        <span>
                            <EditOutlined />
                        </span>
                    </a>

                    <a onClick={() => handleClickDetailUser(record)} style={{ color: 'green' }}>
                        <span>
                            <EyeOutlined />
                        </span>
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <UserViewDetail
                openUserDetail={openUserDetail}
                setOpenUserDetail={setOpenUserDetail}
                setDataViewDetail={setDataViewDetail}
                dataViewDetail={dataViewDetail}
            />
            <InputSearch searchFilter={searchFilter} />
            {isModalOpen === 'add' && (
                <ModalCreateUser
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            )}
            {isModalOpen === 'import' && (
                <ModalImport
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    importData={importData}
                    setImportData={setImportData}
                />
            )}

            <Table
                title={renderHeader}
                columns={columns}
                dataSource={listUser}
                onChange={onTableChange}
                rowKey={'_id'}
                isLoading={isLoading}
                pagination={
                    {
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        total: totalData,
                        onShowSizeChange: onSizeChange,
                        position: ['bottomCenter'],
                    }
                }
            />
        </>
    )
}

export default UserTable;
