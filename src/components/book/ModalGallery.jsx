import { Col, Modal, Row, Image } from "antd";
import { useRef, useState } from "react";
import ReactImageGallery from "react-image-gallery";

const ModalGallery = (props) => {

    const { isOpen, setIsOpen, currentIndex, items, title } = props;

    const refGallery = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <Modal
                width={'60vw'}
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={null} //hide footer
                closable={false} //hide close button
                className="modal-gallery"
            >
                <Row gutter={[20, 20]}>
                    <Col span={16}>
                        <ReactImageGallery
                            ref={refGallery}
                            items={items}
                            showPlayButton={false} //hide play button
                            showFullscreenButton={false} //hide fullscreen button
                            startIndex={currentIndex} // start at current index
                            showThumbnails={false} //hide thumbnail
                            onSlide={(i) => setActiveIndex(i)}
                            slideDuration={0} //duration between slices
                        />
                    </Col>
                    <Col span={8}>
                        <div style={{ padding: "5px 0 20px 0" }}>{title}</div>
                        <div>
                            <Row gutter={[20, 20]}>
                                {
                                    items?.map((item, i) => {
                                        return (
                                            <Col key={`image-${i}`}>
                                                <Image
                                                    wrapperClassName={"img-normal"}
                                                    width={100}
                                                    height={100}
                                                    src={item.original}
                                                    preview={false}
                                                    onClick={() => {
                                                        refGallery.current.slideToIndex(i);
                                                    }}
                                                />
                                                <div className={activeIndex === i ? "active" : ""}></div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default ModalGallery;