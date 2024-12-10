import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload, Image, Divider } from 'antd';
import { createBook, getBookCategory, updateBook, uploadBookImage } from '../../../services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ModalEditBook = (props) => {
    const { setIsModalOpen, isModalOpen, dataViewDetail, setDataViewDetail, fetchListBook } = props;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectCategory, setSelectCategory] = useState(null);
    const [thumbnailData, setThumbnailData] = useState([]);
    const [sliderData, setSliderData] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [initForm, setInitForm] = useState('');

    useEffect(() => {
        if (dataViewDetail?._id) {
            const arrThumbnail = [{
                uid: uuidv4(),
                name: dataViewDetail?.thumbnail,
                status: 'done',
                url: `${baseUrl}/images/book/${dataViewDetail?.thumbnail}`,
            }];

            const arrSlider = dataViewDetail?.slider?.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${baseUrl}/images/book/${item}`,
                }
            })

            const initValues = {
                _id: dataViewDetail._id,
                mainText: dataViewDetail.mainText,
                author: dataViewDetail.author,
                price: dataViewDetail.price,
                category: dataViewDetail.category,
                quantity: dataViewDetail.quantity,
                sold: dataViewDetail.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider }
            }

            setInitForm(initValues);
            setThumbnailData(arrThumbnail);
            setSliderData(arrSlider);
            form.setFieldsValue(initValues);
        }

        return () => {
            form.resetFields();
        }
    }, [dataViewDetail]);

    useEffect(() => {
        const fetchSelectCategory = async () => {
            const res = await getBookCategory();
            if (res && res.data && res.data.length > 0) {
                const selectList = res.data.map(item => { return { label: item, value: item } });
                if (selectList.length > 0)
                    setSelectCategory(selectList);
            }
        };

        fetchSelectCategory();
    }, [])

    const handleOk = () => {
        form.submit(onFinish);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setInitForm(null);
        setDataViewDetail(null);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const onFinish = async (values) => {
        const { _id, mainText, author, price, sold, quantity, category } = values;

        if (thumbnailData && thumbnailData.length === 0) {
            notification.error({
                message: 'Error',
                description: 'Không có thumbnail sách'
            })
            return;
        }
        if (sliderData && sliderData.length === 0) {
            notification.error({
                message: 'Error',
                description: 'Không có slider sách'
            })
            return;
        }

        const thumbnail = thumbnailData[0].name;
        const slider = sliderData.map(item => item.name);

        try {
            const res = await updateBook(_id, thumbnail, slider, mainText, author, price, sold, quantity, category)
            if (res && res.data) {
                message.success('Sửa thông tin sách thành công!');
                await fetchListBook();
            }
        } catch (error) {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: error?.response?.data?.message || error.message || 'Có lỗi không xác định xảy ra.',
            })
        } finally {
            form.resetFields();
            setThumbnailData([]);
            setSliderData([]);
            setIsModalOpen(false);
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await uploadBookImage(file);
        if (res && res.data) {
            setThumbnailData([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await uploadBookImage(file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setSliderData((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getImageBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setThumbnailData([])
        }
        if (type === 'slider') {
            const newSlider = sliderData.filter(x => x.uid !== file.uid);
            setSliderData(newSlider);
        }
    }

    return (
        <>
            <Modal title="Sửa thông tin sách"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={'50vw'}
            >
                <Divider />

                <Form
                    name="basic"
                    onFinish={onFinish}
                    form={form}
                    initialValues={initForm}
                >
                    <Row gutter={[8, 0]}>
                        <Col hidden>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="_id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: 'Tên sách không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Tác giả không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 0]}>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: 'Giá tiền không được để trống!' }]}
                            >
                                <InputNumber
                                    prefix="VND"
                                    style={{ width: '100%' }}
                                    formatter={(num) => num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                            >
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Search to Select"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={selectCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: 'Số lượng không được để trống!' }]}
                            >
                                <InputNumber min={1} initialValues={10} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                            >
                                <InputNumber min={0} initialValues={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 0]}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail Sách"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    defaultFileList={initForm?.thumbnail?.fileList ?? []}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>

                                    </div>

                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider Sách"
                                name="slider"
                            >
                                <Upload
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    defaultFileList={initForm?.slider?.fileList ?? []}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
export default ModalEditBook;