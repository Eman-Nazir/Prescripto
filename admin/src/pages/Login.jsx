import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import {toast} from 'react-toastify'
import { DoctorContext } from "../context/DoctorContext";


const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          console.log(data.token);
        localStorage.setItem('aToken' , data.token)
          setAToken(data.token);
        }else{
        toast.error(data.message)

        }
      } 
      else {
        
        const {data} = await axios.post(backendUrl + '/api/doctor/login' , {email,password})

          if (data.success) {
        localStorage.setItem('dToken' , data.token)
          setDToken(data.token);
          console.log(data.token);

        }else{
        toast.error(data.message)

        }








      }
    } catch {}
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border-2 border-[#BDBDBD] rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        {/* Heading */}
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[var(--main-blue)]">{state}</span> Login
        </p>

        {/* Email Field */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        {/* Login Button */}
        <button className="bg-[var(--main-blue)] text-white w-full py-2 rounded-md text-base cursor-pointer">
          Login
        </button>

        {/* Switch Login Type */}
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-[var(--main-blue)] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-[var(--main-blue)] underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;



