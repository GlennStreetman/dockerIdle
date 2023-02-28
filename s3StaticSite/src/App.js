import './App.css';
import Paper from '@mui/material/Paper';
import {useEffect} from "react"
import { Route, Routes, useLocation } from 'react-router-dom';

import LoggedIn from "./components/LoggedIn"
import Login from "./components/Login"

function App() {
  const { pathname, hash, key } = useLocation();


  useEffect(()=>{
    let paramList = hash.replaceAll('#', '')
    const accessToken = paramList?.split("&")?.reduce((acc, el)=> {
      const [key, val] = el.split("=")
      acc[key] = val
      return acc
    },{})?.access_token || false
    console.log(accessToken)
    if (accessToken) localStorage.setItem("access_token", accessToken)
  },[])


  return (
    <main>
      <Paper sx={{
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        
          <Routes>
            <Route path='/' exact element={<Login />} />
            <Route path='/Server/' element={<LoggedIn/>}/>
          </Routes>
        
      </Paper>
    </main>
  ); 
}

export default App;
