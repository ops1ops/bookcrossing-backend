import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USER, // generated ethereal user
    pass: process.env.MAILER_PASSWORD, // generated ethereal password
  },
});

async function mailer(email, id) {
  const info = await transporter.sendMail({
    from: `"BookCrossing" ${process.env.MAILER_USER}`, // sender address
    to: email, // list of receivers
    subject: "Book update", // Subject line
    html: `
      <h2>BookCrossing service</h2>
      <p><a href='http://localhost:3000/book/${id}'>Book updated</a></p>
    `
  });
}

export default mailer;