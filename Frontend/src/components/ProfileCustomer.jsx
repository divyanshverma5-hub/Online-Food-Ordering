import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import { useNavigate } from "react-router-dom";
import "../style/profile.css";
import { API_BASE } from "../config";
function ProfileCustomer(){
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [changeData, setChangeData] = useState(data);
    useEffect(() => {
        let getData = async () => {
            let result = await fetch(`${API_BASE}/profileCustomer`,{
                credentials: "include"
            });
            result = await result.json();
            setData(result.data[0]);
            setChangeData(result.data[0]);
        }
        getData();
    }, []);
    async function handleSubmit(){
        let result = await fetch(`${API_BASE}/editCustomerProfile`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changeData)
        });
        result = await result.json();
        if(result.success){
            setData(changeData);
            setEdit(false);
            localStorage.setItem("name", changeData.name);
        }
    }
    function handleChange(event){
        let name = event.target.name;
        let value = event.target.value;
        setChangeData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const initial = data.name ? data.name.trim().charAt(0).toUpperCase() : "?";
    return(
        <>
            <CustomerNavbar />
            <div className="pf-page">
                <h1>
                    My Profile
                </h1>
                <div className="pf-header-card">
                    <div className="pf-avatar">
                        {initial}
                    </div>
                    <div className="pf-header-info">
                        <h2>
                            {data.name}
                        </h2>
                        <p className="pf-contact-row">
                            ✉️ {data.email}
                        </p>
                        <p className="pf-contact-row">
                            📞 {data.phone}
                        </p>
                        {!edit &&
                            <div className="pf-header-actions">
                                <button className="pf-btn-primary" onClick={() => setEdit(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        }
                    </div>
                </div>
                {edit &&
                    <div className="pf-edit-card">
                        <h3>
                            Edit Profile
                        </h3>
                        <div className="pf-form-grid">
                            <div className="pf-field">
                                <label>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    value={changeData.name}
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
                        </div>
                        <div className="pf-edit-actions">
                            <button
                                className="pf-btn-secondary"
                                onClick={() => {
                                    setEdit(false);
                                    setChangeData(data);
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
                }
            </div>
        </>
    );
}
export default ProfileCustomer;