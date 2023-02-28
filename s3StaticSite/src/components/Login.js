import React from 'react'
import {  useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import {useEffect} from "react"

function Login() {
    const navigate = useNavigate();
    useEffect(()=>{
        if (localStorage.getItem('access_token') && 
        localStorage.getItem('access_token')!== "undefined") navigate("/Server", { replace: true })
    })
    
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
            <b>You are not logged in</b>
            <a href={`https://idle.auth.us-east-2.amazoncognito.com/login?client_id=2g1msdiu2cuatspd9bmgmemipp&response_type=token&scope=email+openid+phone&redirect_uri=${process.env.REACT_APP_REDIRECT}`}>Sign in</a>
        </Box>
    )
}

export default Login