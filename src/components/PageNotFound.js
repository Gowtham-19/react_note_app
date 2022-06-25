import React from 'react'
import { Button } from "reactstrap"
import {useNavigate} from "react-router-dom"
import Rotate from 'react-reveal/Rotate';

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <>
        <Rotate left>
        <div className='pagenotfound'>
                404:
            Oops! Page Not Found
        </div>
        <div className='text-center' style={{"fontSize":"25px"}}>
        <p className='message'>Please click below to move home page</p>
        <Button color="primary" onClick={() => {
            navigate("/")            
        }}>Go Home</Button>
        </div>
        </Rotate >
        </>
    )
}

export default PageNotFound