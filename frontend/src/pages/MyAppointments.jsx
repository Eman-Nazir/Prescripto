import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

// We render all the data from the doctors that are in assets

const MyAppointments = () => {
  const { backendUrl, token, getDoctorData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_"); // ["20", "7", "2024"]
    const day = dateArray[0];
    const month = months[Number(dateArray[1])]; // convert "7" to 7 → "Jul"
    const year = dateArray[2];
    return `${day} ${month} ${year}`; // "20 Jul 2024"
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //   CancelAppointment

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId);

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorData;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b border-b-[#D1D1D1]">
        My appointments
      </p>

      <div>
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] sm:flex sm:gap-6 py-4 border-b border-b-[#D1D1D1]"
          >
            {/* Image */}
            <div>
              <img
                src={item.docData.image}
                alt=""
                className="w-32 bg-indigo-50"
              />
            </div>

            {/* Details */}
            <div className="flex-1  text-sm  text-zinc-600">
              <p className="font-semibold text-neutral-800">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs ">{item.docData.address.line1}</p>
              <p className="text-xs ">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="font-medium text-sm text-neutral-700">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)}| {item.slotTime}
              </p>
            </div>
            <div></div>

            {/* Actions */}
            <div className=" flex flex-col gap-2 justify-end">
              {!item.cancelled && (
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[var(--main-blue)] hover:text-white transition-all duration-300">
                  Pay Online
                </button>
              )}

              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Cancel Appointment
                </button>
              )}

              {item.cancelled && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
