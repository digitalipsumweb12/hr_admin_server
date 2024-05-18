import db from "../config/db.js";
import jwt from "jsonwebtoken";

// ------------------------[Register]

export const register = async (req, res) => {
  try {
    const { username, email, password, signature, role } = req.body;

    // Check if the email already exists in the database
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (selectError, selectResults) => {
        if (selectError) {
          console.error(selectError);
          return res.status(500).json({ message: "Internal server error" });
        }

        // If an email with the same address exists, return a 400 response
        if (selectResults.length > 0) {
          return res.status(400).json({ message: "Email already exists" });
        }

        db.query(
          "INSERT INTO users (username, email, password, signature, role) VALUES (?, ?, ?, ?, ?)",
          [username, email, password, signature, role],
          (insertError, insertResults) => {
            if (insertError) {
              console.error(insertError);
              return res.status(500).json({ message: "Internal server error" });
            }

            return res
              .status(201)
              .json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------------[Register]

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const selectUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(selectUserQuery, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = results[0];

    // Check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    } else {
      // Create and sign JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Set token as cookie and send success response
      res.cookie("jwt", token);
      return res
        .status(200)
        .json({ message: "Login successful.", token: token, id: user.id });
    }
  });
};

