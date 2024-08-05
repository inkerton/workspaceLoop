"use client"
import React, {useState} from 'react'
import axios from 'axios'

const Register = () => {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await axios.post('api/register', {username,password});
        console.log(response.data);
        if(response.status == 200){
            return alert("registered successfully");
        }
        return alert("register failed");
    }


    return (
        <div>
            <div className='w-full min-h-screen flex justify-center items-center'>
                <form onSubmit={handleSubmit}>
                    <div className='p-10 gap-2 border'>
                    <input 
                    type='Username' 
                    placeholder='Username' 
                    value={username} 
                    onChange={(e)=>setUsername(e.target.value)}
                    required 
                    />
                    <input 
                    type='Password' 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)}
                    required 
                    />
                    </div>
                    <button className='border' type='submit'>
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;