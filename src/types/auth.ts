import { Socket } from "socket.io"
import { JwtPayload } from "jsonwebtoken"

type SocketAuthType = (socket:Socket, next:(err?:any)=>void)=>void

interface JwtUserType extends JwtPayload {
  id:string
}

export type { SocketAuthType, JwtUserType }
