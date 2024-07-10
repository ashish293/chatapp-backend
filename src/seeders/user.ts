import User from "../models/user";
import { faker } from "@faker-js/faker";
import Chat from "../models/chat";
import Message from "../models/message";


const seedUsers = async () => {
  try {
    const userPromise = Array.from({ length: 10 }).map(() => {
      const user = User.create({
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
    const otherUsers = users.filter((user) => user._id !== users[i]._id)
    const addtoGroup = otherUsers.slice(0, 3)
    const chat = await Chat.create({
      name: `Group ${i + 1}`,
      members: [users[i]._id, ...addtoGroup.map((user) => user._id)],
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