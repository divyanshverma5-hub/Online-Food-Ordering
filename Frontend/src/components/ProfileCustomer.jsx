import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import { useNavigate } from "react-router-dom";

function ProfileCustomer() {
    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [edit, setEdit] = useState(false)
    const [changeData, setChangeData] = useState(data)

    useEffect(() => {
        let getData = async () => {
            let result = await fetch(`http://localhost:3000/profileCustomer?customer_id=${localStorage.getItem("id")}`)
            result = await result.json();
            setData(result.data[0])
            setChangeData(result.data[0])
        }
        getData()
    }, [])

    async function handleSubmit() {
        let result = await fetch("http://localhost:3000/editCustomerProfile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changeData)
        })
        result = await result.json();
        if (result.success) {
            setData(changeData)
            setEdit(false)
            localStorage.setItem("name", changeData.name)
        }
    }

    function handleChange(event) {
        let name = event.target.name
        let value = event.target.value

        setChangeData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    return (
        <>
            <CustomerNavbar />
            <h1>Customer Profile</h1>
            {!edit && <>
                <h3>Name: {data.name}</h3>
                <h3>Email: {data.email}</h3>
                <h3>Phone: {data.phone}</h3>

                <button onClick={() => setEdit(true)}>Edit</button>
            </>}

            {edit && <>
                <h3>Name:</h3>
                <input value={changeData.name} onChange={(e) => handleChange(e)} name="name" type="text" autoComplete="off"/>
                <h3>Phone:</h3>
                <input value={changeData.phone} onChange={(e) => handleChange(e)} name="phone" type="number" />

                <button onClick={() => {setEdit(false), setChangeData(data)}}>Cancel</button>
                <button onClick={handleSubmit}>Save</button>
            </>}


        </>
    )
}

export default ProfileCustomer