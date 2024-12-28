import { MailtrapClient } from "mailtrap"

// const TOKEN = "b42435200835223258a9960a58f7e92f";

const client = new MailtrapClient({
  token: "1655e507df3bb62e4080b4149c38e67e",
  endpoint: "https://send.api.mailtrap.io/api/send"
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "jeremiahv791@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);