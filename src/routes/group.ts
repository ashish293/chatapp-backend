import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMember, deleteGroup, getMyGroup, leaveGroup, newGroup, removeMember, updateGroup } from "../controllers/group.js";

const groupRouter = Router();

groupRouter.use(isAuthenticated)
  .post('/new', newGroup)
  .get('/mygroups', getMyGroup)
  .put('/addmember', addMember)
  .delete('/removemember', removeMember)
  .delete('/leave', leaveGroup)
  .delete('/delete', deleteGroup)
  .patch('/update', updateGroup)

export default groupRouter