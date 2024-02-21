import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../../css/AddEvent.css";

import useAuth from "../../../hooks/useAuth";
import Header from "../../../components/Header/Header";

function MyBaby() {
    const [babies, setBabies] = useState([])
    const [showParentImage, setShowParentImage] = useState(false);
    const [parentImages, setParentImages] = useState({ father: null, mother: null });

    const handleImageClick = (father, mother) => {
        setParentImages({ father, mother });
        setShowParentImage(true);
    };
    const { user } = useAuth();

    useEffect(() => {
        async function fetchBaby() {
            try {
                const response = await axios.get(`https://databaseswap.mangasocial.online/get/list_2_image/id_image_swap_baby_all_future_love?id_user=${user?.id_user}`);
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                const data = response.data;
                setBabies(data.id_su_kien_swap_image);
            } catch (error) {
                console.error('There was a problem fetching the video list:', error);
            }
        }
        fetchBaby();
    }, [user]);

    return (
        <>
            <Header
                data={{
                    title: "my collection",
                    download: true,
                }}
            />

            <div className="grid grid-cols-3 gap-4">
                {babies.map((image, index) => (
                    <div key={index} className="relative p-4">
                        <img
                            src={image.link_da_swap}
                            alt={image.alt}
                            className="w-full h-auto object-cover cursor-pointer rounded-md"
                            style={{ aspectRatio: '1 / 1' }}
                            onClick={() => handleImageClick(image.link_nam_goc, image.link_nu_goc)}
                        />
                    </div>
                ))}
            </div>

            {showParentImage && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center"
                    onClick={() => setShowParentImage(false)}
                >
                    <div className="flex items-center">
                        <div className="mr-4">
                            <img
                                src={parentImages.father}
                                alt="Father"
                                className="w-96 h-96 rounded-full"
                            />
                            <p className="text-white text-center">Father</p>
                        </div>
                        <div>
                            <img
                                src={parentImages.mother}
                                alt="Mother"
                                className="w-96 h-96 rounded-full"
                            />
                            <p className="text-white text-center">Mother</p>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default MyBaby;
