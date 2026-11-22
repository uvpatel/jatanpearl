"use client";

import { useState } from "react";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guestText = guests === "1" ? "1 Guest" : `${guests} Guests`;
    const message = `Hello Pearl & Jatan,\n\nI am delighted to confirm our presence for your wedding celebrations!\n\n• Full Name: ${name.trim() || "Guest"}\n• Phone: ${phone.trim() || "Not provided"}\n• Number of Guests: ${guestText}\n\nLooking forward to celebrating with you!`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="ry-rsvp-section" id="rsvp" aria-label="Confirm Presence">
      <div className="ry-rsvp-header">
        <h2 className="ry-sec-title">PLEASE CONFIRM YOUR PRESENCE</h2>
        <div className="ry-title-ornament" aria-hidden="true" />
      </div>

      <div className="ry-rsvp-card">
        <form onSubmit={handleSubmit} className="ry-rsvp-form">
          <div className="ry-form-field">
            <label htmlFor="ryRsvpName" className="ry-form-label">
              FULL NAME
            </label>
            <input
              id="ryRsvpName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="ry-form-input"
            />
          </div>

          <div className="ry-form-field">
            <label htmlFor="ryRsvpPhone" className="ry-form-label">
              PHONE NUMBER
            </label>
            <input
              id="ryRsvpPhone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="ry-form-input"
            />
          </div>

          <div className="ry-form-field">
            <label htmlFor="ryRsvpGuests" className="ry-form-label">
              NUMBER OF GUESTS
            </label>
            <select
              id="ryRsvpGuests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="ry-form-select"
            >
              <option value="" disabled hidden>
                Select number of guests
              </option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5+">5+ Guests</option>
            </select>
          </div>

          <button type="submit" className="ry-rsvp-submit">
            SEND VIA WHATSAPP
          </button>
        </form>
      </div>
    </section>
  );
}
