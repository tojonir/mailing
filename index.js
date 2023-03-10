require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const yup = require("yup");

const mailMeSchema = yup.object({
  name: yup.string().required(),
  mail: yup.string().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
});

const app = express();
app.use(json());
app.use(cors());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from resume!");
});

app.post("/", async (req, res) => {
  if (req.body.to === undefined) {
    return res.status(401).json("receiver is required");
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_AUTH,
    },
  });

  await transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: req.body.to,
      subject: "ANDRIANARIJAONA Tojonirina",
      html: {
        path: "./public/mail.html",
      },
      encoding: "text/html",
      attachments: [
        {
          path: "./public/ANDRIANARIJAONA Tojonirina.pdf",
        },
        {
          path: "./public/in.png",
          cid: "in",
        },
        {
          path: "./public/instagram.png",
          cid: "insta",
        },
        {
          path: "./public/Profile.png",
          cid: "profile",
        },
      ],
    },
    (err) => {
      if (err) return res.status(400).json(err);
      return res.status(200).send("sent");
    }
  );
});

app.post("/mail-me", async (req, res) => {
  try {
    mailMeSchema.validateSync(req.body);
  } catch (error) {
    return res.status(404).json(error.message);
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_AUTH,
    },
  });

  await transporter.sendMail(
    {
      from: req.body.mail,
      to: process.env.EMAIL_USER,
      cc: req.body.mail,
      subject: req.body.subject,
      html: `<p>${req.body.name}</p><p>${req.body.message}</p>`,
    },
    (err) => {
      if (err) return res.status(400).json(err);
      return res.status(200).send("sent");
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

module.exports = app;
