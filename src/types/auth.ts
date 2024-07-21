import { Socket } from "socket.io"
import { JwtPayload } from "jsonwebtoken"
import { ExtendedError } from "socket.io/dist/namespace"

type SocketAuthType = (socket:Socket, next:(err?:ExtendedError)=>void)=>void

interface JwtUserType extends JwtPayload {
  id:string
}

export type { SocketAuthType, JwtUserType }
