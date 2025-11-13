import express from "express";

import nodemailer from "nodemailer";

import pool from "./db.js"; // ✅ PostgreSQL connection file

import dotenv from "dotenv";

 

dotenv.config();

 

const router = express.Router();

 

router.post("/", async (req, res) => {

  console.log("🚀 Contact API HIT!");

  console.log("📦 Request body:", req.body);

 

  const { name, email, message } = req.body;

 

  if (!name || !email || !message) {

    console.log("⚠️ Missing required fields!");

    return res.status(400).json({ error: "All fields are required" });

  }

 

  try {

    // ✅ Save to PostgreSQL

    await pool.query(

      "INSERT INTO contact_enquiries (name, email, message, created_at) VALUES ($1, $2, $3, NOW())",

      [name, email, message]

    );

    console.log("🟢 Data saved to DB successfully!");

 

    // ✅ Setup Nodemailer

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS, // Gmail App Password

      },

    });

 

    console.log("📨 Mail transporter created successfully!");

 

    const mailOptions = {

      from: `"DGSTECH Contact" <${process.env.EMAIL_USER}>`,

      to: process.env.EMAIL_USER,

      subject: `New Contact Message from ${name}`,

      text: `

        You received a new contact message:

 

        Name: ${name}

        Email: ${email}

       

        Message:

        ${message}

      `,

    };

 

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");

 

    res.status(200).json({ message: "Message saved and email sent successfully!" });

  } catch (error) {

    console.error("❌ Error in contact route:", error);

    res.status(500).json({ error: "Something went wrong while sending email" });

  }

});

 

export default router;