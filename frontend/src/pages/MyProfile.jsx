import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import {assets} from '../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';


const MyProfile = () => {
   const {userData,setUserData,token ,backendUrl,loadUserProfileData}  = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);
  const[image,setImage] = useState(false)


const  updateUserProfileData =  async () => {
      
        try {
          
          const formData = new FormData()
          formData.append('name',userData.name)
          formData.append('phone' , userData.phone)
          formData.append('address' , JSON.stringify(userData.address))
          formData.append('gender' , userData.gender)
          formData.append('dob' , userData.dob)

          image && formData.append('image' ,image)

          const {data} = await axios.postForm(backendUrl + '/api/user/update-profile' , formData,{headers:{token}})


          if (data.success) {
         toast.success(data.message)
        await loadUserProfileData() 
        setIsEdit(false)
        }

           else{
            toast.error(data.message)
          }

        } catch (error) {
           console.log(error);
           toast.error(error.message)

           
        }
}
 


  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

    {
      isEdit 
      ? <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ?  URL.createObjectURL(image):userData.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ?  " " :assets.upload_icon } alt="" />
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file"  id='image' hidden/>
      </label>
      : 
      <img className='w-36 h-36 object-cover rounded-none' src={userData.image} alt="Profile" />
    }

      
      {/* Name */}
      {
        isEdit ? (
          <input
            className='text-black text-3xl font-medium max-w-60 mt-4  px-2'
            type='text'
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({
              ...prev,
              name: e.target.value
            }))}
          />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
        )
      }

      <hr className='bg-zinc-400 h-[1px] border-0' />

      {/* Contact Info */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3'>
          <p className='font-medium'>Email id:</p>
          {
            isEdit ? (
              <input
                className='bg-gray-100 max-w-52 px-2 py-1 text-blue-500'
                type='email'
                value={userData.email}
                onChange={(e) => setUserData((prev) => ({
                  ...prev,
                  email: e.target.value
                }))}
              />
            ) : (
              <p className='text-blue-500'>{userData.email}</p>
            )
          }

          <p className='font-medium'>Phone:</p>
          {
            isEdit ? (
              <input
                className='bg-gray-100 max-w-52 px-2 py-1'
                type='text'
                value={userData.phone}
                onChange={(e) => setUserData((prev) => ({
                  ...prev,
                  phone: e.target.value
                }))}
              />
            ) : (
              <p className='text-blue-500'>{userData.phone}</p>
            )
          }

          <p className='font-medium'>Address:</p>
          {
            isEdit ? (
              <div>
                <input
                  className='bg-gray-50 w-full mb-1 px-2 py-1'
                  onChange={(e) => setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))}
                  value={userData.address.line1}
                  type='text'
                />
                <input
                  className='bg-gray-50 w-full px-2 py-1'
                  onChange={(e) => setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))}
                  value={userData.address.line2}
                  type='text'
                />
              </div>
            ) : (
              <p className='text-gray-500'>
                {userData.address.line1}<br />{userData.address.line2}
              </p>
            )
          }
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit ? (
              <select
                className='max-w-20 bg-gray-100 px-2 py-1'
                onChange={(e) => setUserData((prev) => ({
                  ...prev, gender: e.target.value
                }))}
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className='text-gray-400'>{userData.gender}</p>
            )
          }

          <p className='font-medium'>Birthday:</p>
          {
            isEdit ? (
              <input
                className='max-w-40 bg-gray-100 px-2 py-1'
                type='date'
                onChange={(e) => setUserData((prev) => ({
                  ...prev, dob: e.target.value
                }))}
                value={userData.dob}
              />
            ) : (
              <p className='text-gray-400'>
                {new Date(userData.dob).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )
          }
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-4'>
        {
          isEdit ? (
            <button
              onClick={updateUserProfileData}
              className='border border-[var(--main-blue)] px-8 py-2 rounded-full hover:bg-[var(--main-blue)] transition-all'
            >
              Save Information
            </button>
          ) : (
            <button
               onClick={() => setIsEdit(true)}
              className='border border-[var(--main-blue)] px-8 py-2 rounded-full hover:bg-[var(--main-blue)] transition-all'
            >
              Edit
            </button>
          )
        }
      </div>
    </div>
  )
}

export default MyProfile;
