import React, { useEffect, useState } from "react";
import CustomerNavbar from "./CustomerNavbar";
import { useNavigate } from "react-router-dom";
import RestaurantNavbar from "./RestaurantNavbar";

function ProfileRestaurant() {
    const navigate = useNavigate()

    //useState:
    const [data, setData] = useState([])
    const [edit, setEdit] = useState(false)
    const [changeData, setChangeData] = useState(data)
    const [image, setImage] = useState(null)

    useEffect(() => {
        let getData = async () => {
            let result = await fetch(`http://localhost:3000/profileRestaurant?restaurant_id=${localStorage.getItem("id")}`)
            result = await result.json();
            setData(result.data[0])
            setChangeData(result.data[0])
        }
        getData()
    }, [])

    console.log(changeData)

    async function handleSubmit() {

        const formData = new FormData();
        formData.append("owner_name", changeData.owner_name)
        formData.append("email", changeData.email)
        formData.append("phone", changeData.phone)
        formData.append("restaurant_name", changeData.restaurant_name)
        formData.append("city", changeData.city)
        formData.append("location", changeData.location)
        formData.append("open_time", changeData.open_time)
        formData.append("close_time", changeData.close_time)
        formData.append("id", changeData.id)
        formData.append("img_url", changeData.img_url)
        formData.append("cloudinary_public_id", changeData.cloudinary_public_id)
        formData.append("image", image)


        let result = await fetch("http://localhost:3000/editRestaurantProfile", {
            method: "PATCH",
            body: formData
        })
        result = await result.json();
        if (result.success) {
            setData(changeData)
            setEdit(false)
            localStorage.setItem("name", changeData.owner_name)
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
            <RestaurantNavbar />
            <h1>Restaurant Profile</h1>
            {!edit && <>
                <h3>Owner Name: {data.owner_name}</h3>
                <h3>Restaurant Name: {data.restaurant_name}</h3>
                <h3>Email: {data.email}</h3>
                <h3>Phone: {data.phone}</h3>
                <h3>City: {data.city}</h3>
                <h3>Complete Address: {data.location}</h3>
                <h3>Open Time: {data.open_time}</h3>
                <h3>Close Time: {data.close_time}</h3>
                <h3>Restaurant Image: {data.img_url}</h3>

                <button onClick={() => setEdit(true)}>Edit</button>
            </>}

            {edit && <>
                <h3>Restaurant Name:</h3>
                <input value={changeData.restaurant_name} onChange={(e) => handleChange(e)} name="restaurant_name" type="text" autoComplete="off" />

                <h3>Owner Name:</h3>
                <input value={changeData.owner_name} onChange={(e) => handleChange(e)} name="owner_name" type="text" autoComplete="off" />

                <h3>Phone:</h3>
                <input value={changeData.phone} onChange={(e) => handleChange(e)} name="phone" type="number" />

                <h3>City:</h3>
                <input value={changeData.city} onChange={(e) => handleChange(e)} name="city" type="text" autoComplete="off" />

                <h3>Complete Address:</h3>
                <textarea value={changeData.location} onChange={(e) => handleChange(e)} name="location" type="text" autoComplete="off" rows={4} />

                <h3>Opening Time:</h3>
                <input value={changeData.open_time} onChange={(e) => handleChange(e)} name="open_time" type="time" autoComplete="off" />

                <h3>Closing Time:</h3>
                <input value={changeData.close_time} onChange={(e) => handleChange(e)} name="close_time" type="time" autoComplete="off" />

                <h3>Restaurant Image :</h3>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} name="image"/>
                {/* <input value={changeData.img_url} onChange={(e) => handleChange(e)} name="img_url" type="text" autoComplete="off" /> */}


                <button onClick={() => { setEdit(false), setChangeData(data) }}>Cancel</button>
                <button onClick={handleSubmit}>Save</button>
            </>}


        </>
    )
}

export default ProfileRestaurant