import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar/lib";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales
});

const ResortBookingApp = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ guestName: "", contact: "", start: null, end: null });

  const rooms = Array.from({ length: 10 }, (_, i) => `Room ${i + 1}`);

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleSelectSlot = ({ start, end }) => {
    if (!selectedRoom) {
      alert("Please select a room first.");
      return;
    }
    setFormData({ guestName: "", contact: "", start, end });
    setFormVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { guestName, contact, start, end } = formData;
    if (guestName && contact) {
      const newBooking = {
        id: Date.now(),
        title: `${guestName} - ${selectedRoom}`,
        start,
        end,
        room: selectedRoom,
        fulfilled: false
      };
      setBookings([...bookings, newBooking]);
      setFormVisible(false);
    }
  };

  const handleSelectEvent = (event) => {
    const action = window.confirm(
      `Mark booking for ${event.title} as fulfilled?`
    );
    if (action) {
      setBookings(
        bookings.map((b) =>
          b.id === event.id ? { ...b, fulfilled: !b.fulfilled } : b
        )
      );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="p-5">
        <h1 className="text-xl font-bold">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 block"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 block"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mb-3">
        Logout
      </button>
      <h1 className="text-xl font-bold">Resort Booking Management</h1>
      <div className="mb-3">
        <label className="font-semibold">Select Room:</label>
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="">-- Select a Room --</option>
          {rooms.map((room) => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
        {selectedRoom && <p className="mt-2 text-green-600">Selected Room: {selectedRoom}</p>}
      </div>
      <Calendar
        localizer={localizer}
        events={bookings
          .filter(b => b.room === selectedRoom) // Show only selected room's bookings
          .map(b => ({ ...b, title: b.fulfilled ? `✅ ${b.title}` : b.title }))}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
      />
      {formVisible && (
        <div className="p-5 border mt-5">
          <h2 className="text-lg font-bold">Enter Booking Details</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Guest Name"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              className="border p-2 mb-2 block w-full"
              required
            />
            <input
              type="text"
              placeholder="Contact Info"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="border p-2 mb-2 block w-full"
              required
            />
            <button type="submit" className="bg-green-500 text-white p-2">
              Save Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResortBookingApp;
