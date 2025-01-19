const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Endpoints

// 1. Fetch all restaurants
app.get("/restaurants", async (req, res) => {
  const { data, error } = await supabase.from("restaurants").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Fetch a specific restaurant by ID
app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Create a booking
app.post("/bookings", async (req, res) => {
  const { restaurant_id, user_name, user_email, date, time, guests } = req.body;

  // Validate input
  if (!restaurant_id || !user_name || !user_email || !date || !time || !guests) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { data, error } = await supabase.from("bookings").insert([
    { restaurant_id, user_name, user_email, date, time, guests },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// 4. Fetch bookings for a specific restaurant
app.get("/restaurants/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("bookings").select("*").eq("restaurant_id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5. Delete a booking (optional)
// app.delete("/bookings/:id", async (req, res) => {
//   const { id } = req.params;
//   const { data, error } = await supabase.from("bookings").delete().eq("id", id);
//   if (error) return res.status(500).json({ error: error.message });
//   res.json({ message: "Booking deleted successfully", data });
// });// 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
