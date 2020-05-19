import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

async function mailer(email, id) {
  await transporter.sendMail({
    from: `"BookCrossing" ${process.env.MAILER_USER}`,
    to: email,
    subject: "Book update",
    html: `
      <h2>BookCrossing service</h2>
      <p><a href='http://localhost:3000/book/${id}'>Book updated</a></p>
    `
  });
}

export default mailer;
