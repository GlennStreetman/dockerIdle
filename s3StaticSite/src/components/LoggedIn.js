
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import Button from '@mui/material/Button';

import React from 'react'

function LoggedIn() {

    const [msg, setMsg] = useState('')
    
    const navigate = useNavigate();
    useEffect(()=>{
        if (localStorage.getItem('access_token') === null) navigate("/", { replace: true })
    })
    const data = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('access_token').trim(),
        },
    }
    function startServer(){
        fetch(`https://idle.gstreet.dev/api/start`, data)
        .then((response) => response.json())
        .then((data) => {
            setMsg(data)
        });
    }

    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap", 
            flexDirection: "column", 
            gap: "16px", 
            outlineWidth: "2px", 
            outlineColor: "#000", 
            padding: "16px",
            outlineStyle: "solid",
            borderRadius: "0.375rem",
        }}>
            <Box>Logged In, it works!</Box>
            <Button onClick={()=>{startServer()}}>Start Server</Button>
            <a 
            onClick={()=>{localStorage.removeItem("access_token")}} 
            href={`https://idle.auth.us-east-2.amazoncognito.com/login?client_id=2g1msdiu2cuatspd9bmgmemipp&response_type=token&scope=email+openid+phone&redirect_uri=${process.env.REACT_APP_REDIRECT}`} >
                Logout
            </a>
            {msg}
        </Box>
    )
}

export default LoggedIn
