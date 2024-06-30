import User from "../models/user.js";
import { faker } from "@faker-js/faker";
import Chat from "../models/chat.js";
import Message from "../models/message.js";


const seedUsers = async (num) => {
  try {
    const userPromise = Array.from({ length: num }).map(() => {
      const user = new User.create({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: {
          public_id: faker.string.uuid(),
          url: faker.image.avatar()
        }
      })
      return user
    })

    await Promise.all(userPromise)
    console.log("Users seeded");
    process.exit(1)
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};

const seedDirectChat = async () => {
  const users = await User.find({})

  for (let i = 0; i < users.length / 2; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const chat = await Chat.create({
        name: `Direct`,
        members: [users[i]._id, users[j]._id],
        isGroup: false,
        creator: users[i]._id
      })
    }
  }
}
const seedMessages = async () => {
  const users = await User.find({})
  for (let i = 0; i < users.length; i++) {
    const chat = await Chat.find({ members: users[i]._id })
    for (let j = 0; j < chat.length; j++) {
      const message = await Message.create({
        sender: users[i]._id,
        content: faker.lorem.paragraph(),
        attachments: [],
        createdAt: Date.now() + Math.random() * 1000000,
        chatId: chat[j]._id
      })

    }
  }
}
export { seedUsers, seedDirectChat, seedMessages }