import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    EyeOutlined,
    ImportOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Table, Space, Tag, Button, Popconfirm, message, notification } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { deleteBook, getBookWithPaginate } from '../../../services/api';
import { formatDate } from '../../../services/formatDate';
import InputSearch from './InputSearch';
import ModalCreateBook from './ModalCreateBook';
import BookDetail from './BookDetail';
import ModalEditBook from './ModalEditBook';

const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalData, setTotalData] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState('');
    const [dataViewDetail, setDataViewDetail] = useState(null);

    // Fetch books with pagination
    const fetchListBook = useCallback(async () => {
        setIsLoading(true);
        try {
            let query = `current=${currentPage}&pageSize=${pageSize}`;
            if (searchQuery) {
                query += `&${searchQuery}`;
            }

            const res = await getBookWithPaginate(query);

            if (res?.data?.result) {
                setListBook(res.data.result);
            } else {
                setListBook([]);
                message.warning('Không có dữ liệu sách để hiển thị.');
            }

            setTotalData(res?.data?.meta?.total || 0);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'Có lỗi xảy ra khi lấy dữ liệu sách.';
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, searchQuery]);

    useEffect(() => {
        fetchListBook();
    }, [fetchListBook]);

    // Handlers
    const handleDeleteBook = async (id) => {
        try {
            const res = await deleteBook(id);
            if (res && res.data)
                message.success(`Book with ID: ${id} deleted.`);
            else
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
        } catch (error) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error.message || error.response?.data?.message,
            });
        } finally {
            fetchListBook();
        }
    };

    const handleEditBook = (record) => {
        // Placeholder for edit logic
        setDataViewDetail(record);
        setIsModalOpen('edit');
    };

    const handleExportFile = () => {
        // Placeholder for export logic
        console.log('Exporting file:', listBook);
    };

    const handleImportFile = () => {
        // Placeholder for import logic
        console.log('Importing file');
    };

    const handleViewBookDetail = (record) => {
        setIsModalOpen('bookDetail');
        setDataViewDetail(record);
    }

    const searchFilter = (query) => {
        setSearchQuery(query)
    }

    const handleResetTable = () => {
        setSearchQuery(null);
        fetchListBook();
    }

    // Table Columns
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            sorter: (a, b) => a._id.localeCompare(b._id),
            render: (_, record) => (
                <a onClick={() => handleViewBookDetail(record)}> {record._id} </a>
            ),
            width: '15%',
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: (a, b) => a.mainText.localeCompare(b.mainText),
            width: '20%',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: (a, b) => a.author.localeCompare(b.author),
            width: '15%',
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            render: (category) => (
                <Tag color="geekblue" key={category}>
                    {category?.toUpperCase()}
                </Tag>
            ),
            width: '15%',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (price) => price.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
            sorter: (a, b) => a.price - b.price,
            width: '15%',
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: formatDate,
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            width: '15%',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            sorter: (a, b) => parseInt(a.quantity) - parseInt(b.quantity.length),
            width: '10%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xác nhận xóa"
                        onConfirm={() => handleDeleteBook(record._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                    </Popconfirm>
                    <EditOutlined
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                        onClick={() => handleEditBook(record)}
                    />
                </Space>
            ),
        },
    ];

    // Render Table Header
    const renderHeader = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '18px' }}>Table List Books</div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Button type="primary" icon={<ExportOutlined />} onClick={handleExportFile}>
                    Xuất file
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen('add')}>
                    Thêm mới
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleResetTable} />
            </div>
        </div>
    );

    return (
        <>
            <InputSearch searchFilter={searchFilter} />
            {isModalOpen === 'bookDetail' && (
                <BookDetail
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    dataViewDetail={dataViewDetail}
                    setDataViewDetail={setDataViewDetail}
                />
            )}
            {isModalOpen === 'add' && (
                <ModalCreateBook
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    fetchListBook={fetchListBook}
                />
            )}
            {isModalOpen === 'edit' && (
                <ModalEditBook
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    dataViewDetail={dataViewDetail}
                    setDataViewDetail={setDataViewDetail}
                    fetchListBook={fetchListBook}
                />
            )}
            <Table
                title={renderHeader}
                columns={columns}
                dataSource={listBook}
                rowKey="_id"
                loading={isLoading}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalData,
                    showSizeChanger: true,
                    onChange: setCurrentPage,
                    onShowSizeChange: (current, size) => {
                        setPageSize(size);
                        setCurrentPage(current);
                    },
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                }}
            />
        </>
    );
};

export default BookTable;
