import { useLocation } from "react-router";
import ViewDetail from "../../components/book/ViewDetail";
import { useEffect, useState } from "react";
import { getBookById } from "../../services/api";
import { original } from "@reduxjs/toolkit";
const baseUrl = import.meta.env.VITE_BACKEND_URL;

const BookPage = () => {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");
    const [dataBook, setDataBook] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
            const res = await getBookById(id);
            if (res && res.data) {
                let raw = res.data;
                raw.items = getImages(raw);

                setTimeout(() => {
                    setDataBook(raw);
                }, 2000)
            }
        }

        fetchBook();
    }, [id]);

    const getImages = (raw) => {
        const images = [];
        if (raw.thumbnail) {
            images.push({
                original: `${baseUrl}/images/book/${raw.thumbnail}`,
                thumbnail: `${baseUrl}/images/book/${raw.thumbnail}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image"
            });
        }
        if (raw.slider) {
            raw?.slider?.map((item) => {
                images.push({
                    original: `${baseUrl}/images/book/${item}`,
                    thumbnail: `${baseUrl}/images/book/${item}`,
                    originalClass: "original-image",
                    thumbnailClass: "slider-image"
                })
            })
        }
        return images;
    }

    return (
        <>
            <ViewDetail dataBook={dataBook} />
        </>
    )
}

export default BookPage;