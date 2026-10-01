import React, { useEffect, useState } from "react";
import RestaurantNavbar from "./RestaurantNavbar";

import "../style/profile.css";
import { API_BASE } from "../config";

function ProfileRestaurant() {
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [changeData, setChangeData] = useState(data);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const getData = async () => {
            let result = await fetch(`${API_BASE}/profileRestaurant`, {
                credentials: "include"
            });

            result = await result.json();

            setData(result.data[0]);
            setChangeData(result.data[0]);
            setPreview(result.data[0]?.img_url || null);
        };

        getData();
    }, []);

    function handleImagePick(event) {
        const file = event.target.files[0];

        setImage(file);
        setPreview(
            file
                ? URL.createObjectURL(file)
                : changeData.img_url
        );
    }

    async function handleSubmit() {
        const formData = new FormData();

        formData.append("owner_name", changeData.owner_name);
        formData.append("email", changeData.email);
        formData.append("phone", changeData.phone);
        formData.append("restaurant_name", changeData.restaurant_name);
        formData.append("city", changeData.city);
        formData.append("location", changeData.location);
        formData.append("open_time", changeData.open_time);
        formData.append("close_time", changeData.close_time);
        formData.append("id", changeData.id);
        formData.append("img_url", changeData.img_url);
        formData.append("cloudinary_public_id", changeData.cloudinary_public_id);
        formData.append("image", image);

        let result = await fetch(
            `${API_BASE}/editRestaurantProfile`,
            {
                method: "PATCH",
                body: formData,
                credentials: "include"
            }
        );

        result = await result.json();

        if (result.success) {
            setData(changeData);
            setEdit(false);
            localStorage.setItem("name", changeData.owner_name);
        }
    }

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        setChangeData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const initial = data.restaurant_name
        ? data.restaurant_name.trim().charAt(0).toUpperCase()
        : "?";

    return (
        <>
            <RestaurantNavbar />

            <div className="pf-page">
                <h1>Restaurant Profile</h1>

                <div className="pf-header-card">
                    <div className="pf-avatar">
                        {data.img_url ? (
                            <img
                                src={data.img_url}
                                alt={data.restaurant_name}
                            />
                        ) : (
                            initial
                        )}
                    </div>

                    <div className="pf-header-info">
                        <h2>{data.restaurant_name}</h2>

                        <p className="pf-contact-row">
                            👤 Owner: {data.owner_name}
                        </p>

                        <p className="pf-contact-row">
                            ✉️ {data.email}
                        </p>

                        <p className="pf-contact-row">
                            📞 {data.phone}
                        </p>

                        {!edit && (
                            <div className="pf-header-actions">
                                <button
                                    className="pf-btn-primary"
                                    onClick={() => setEdit(true)}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {!edit && (
                    <div className="pf-details-card">
                        <h3>Restaurant Details</h3>

                        <div className="pf-detail-row">
                            <span className="pf-detail-icon">
                                📍
                            </span>

                            <div>
                                <p className="pf-detail-label">
                                    City
                                </p>

                                <p className="pf-detail-value">
                                    {data.city}
                                </p>
                            </div>
                        </div>

                        <div className="pf-detail-row">
                            <span className="pf-detail-icon">
                                🏠
                            </span>

                            <div>
                                <p className="pf-detail-label">
                                    Complete Address
                                </p>

                                <p className="pf-detail-value">
                                    {data.location}
                                </p>
                            </div>
                        </div>

                        <div className="pf-detail-row">
                            <span className="pf-detail-icon">
                                🕒
                            </span>

                            <div>
                                <p className="pf-detail-label">
                                    Timings
                                </p>

                                <p className="pf-detail-value">
                                    {data.open_time} - {data.close_time}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {edit && (
                    <div className="pf-edit-card">
                        <h3>Edit Restaurant Profile</h3>

                        <div className="upload-box">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="upload-preview"
                                />
                            ) : (
                                <span className="upload-placeholder">
                                    🖼
                                </span>
                            )}

                            <label
                                className="upload-btn"
                                htmlFor="restaurantImageInput"
                            >
                                📷 Change Image
                            </label>

                            <input
                                id="restaurantImageInput"
                                className="upload-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImagePick}
                            />
                        </div>

                        <div className="pf-form-grid">
                            <div className="pf-field">
                                <label>
                                    Restaurant Name
                                </label>

                                <input
                                    type="text"
                                    name="restaurant_name"
                                    autoComplete="off"
                                    value={changeData.restaurant_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pf-field">
                                <label>
                                    Owner Name
                                </label>

                                <input
                                    type="text"
                                    name="owner_name"
                                    autoComplete="off"
                                    value={changeData.owner_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pf-field">
                                <label>
                                    Phone
                                </label>

                                <input
                                    type="number"
                                    name="phone"
                                    value={changeData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pf-field">
                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    autoComplete="off"
                                    value={changeData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pf-field pf-span-2">
                                <label>
                                    Complete Address
                                </label>

                                <textarea
                                    rows={3}
                                    name="location"
                                    autoComplete="off"
                                    value={changeData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pf-field">
                                <label>
                                    Opening Time
                                </label>

                                <input
                                    type="time"
                                    name="open_time"
                                    autoComplete="off"
                                    value={changeData.open_time}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pf-field">
                                <label>
                                    Closing Time
                                </label>

                                <input
                                    type="time"
                                    name="close_time"
                                    autoComplete="off"
                                    value={changeData.close_time}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="pf-edit-actions">
                            <button
                                className="pf-btn-secondary"
                                onClick={() => {
                                    setEdit(false);
                                    setChangeData(data);
                                    setPreview(data.img_url);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="pf-btn-primary"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileRestaurant;