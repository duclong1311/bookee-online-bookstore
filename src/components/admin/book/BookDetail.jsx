import { Badge, Descriptions, Divider, Drawer, Upload, Image } from "antd";
import { formatDate } from "../../../services/formatDate";
import { getImageBase64 } from "../../../services/getBase64";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const BookDetail = (props) => {
    const { isModalOpen, setIsModalOpen, dataViewDetail, setDataViewDetail } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (dataViewDetail) {
            let slider = [], thumbnail = {};
            if (dataViewDetail.thumbnail) {
                thumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${baseUrl}/images/book/${dataViewDetail?.thumbnail}`,
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map((item) => {
                    slider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${baseUrl}/images/book/${item}`,
                    });
                })
            }

            setFileList([thumbnail, ...slider]);
        }
    }, [dataViewDetail]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getImageBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setDataViewDetail(null);
    }

    return (
        <>
            <Drawer title="Thông tin chi tiết quyển sách" onClose={handleClose} open={isModalOpen} width={'50vw'}>
                <Descriptions
                    title="Thông tin sách"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.price ?? 0)}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{formatDate(dataViewDetail?.createdAt)}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">{formatDate(dataViewDetail?.updatedAt)}</Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" >Ảnh Book</Divider>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    showUploadList={{ showRemoveIcon: false }}
                />
                {previewImage && (
                    <Image
                        wrapperStyle={{
                            display: 'none',
                        }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default BookDetail;