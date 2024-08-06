import User from "../models/user.js";
import { faker } from "@faker-js/faker";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import { v4 as uuid } from 'uuid';


const seedUsers = async () => {
  try {
    const userPromise = Array.from({ length: 10 }).map(() => {
      const user = User.create({
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.avatar()
      })
      return user
    })

    await Promise.all(userPromise)
    console.log("Users seeded");
  } catch (error) {
    console.log(error);
  }
};

const seedDirectChat = async () => {
  const users = await User.find({})
  for (let i = 0; i < users.length / 2; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const chat = await Chat.create({
        id: uuid(),
        name: `Direct`,
        members: [users[i]._id, users[j]._id],
        isGroup: false,
        creator: users[i]._id
      })
    }
  }
}
const seedGroupChat = async () => {
  const users = await User.find()
  for (let i = 0; i < users.length / 2; i++) {
    const otherUsers = users.filter((user) => user.id !== users[i]._id)
    const addtoGroup = otherUsers.slice(0, 3)
    const chat = await Chat.create({
      id: uuid(),
      name: `Group ${i + 1}`,
      members: [users[i]._id, ...addtoGroup.map((user) => user.id)],
      isGroup: true,
      creator: users[i]._id
    })
  }
}
const seedMessages = async () => {
  const users = await User.find({})
  for (let i = 0; i < users.length; i++) {
    const chat = await Chat.find({ members: users[i]._id })
    for (let j = 0; j < chat.length; j++) {
      const message = await Message.create({
        id: uuid(),
        sender: users[i]._id,
        content: faker.lorem.paragraph(),
        attachments: [],
        createdAt: Date.now() - Math.random() * 1000000,
        chatId: chat[j]._id
      })

    }
  }
}
export { seedUsers, seedDirectChat, seedMessages, seedGroupChat }