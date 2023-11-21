import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    WsException
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
  
@WebSocketGateway(1000, { 
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
        credentials: true,
    } 
})

export class NotificationGateway {

    @WebSocketServer()
    server: Server;
    userSocketMap = new Map<string, Socket>();

    constructor(private readonly authService: AuthService) {}
    
    async handleConnection(client: Socket) {
        const user = await this.getUser(client)

        if (!user)
            return client.disconnect();
        
        this.userSocketMap.set(user.userID, client)
    }

    async handleDisconnect(client: Socket) {

        const user = await this.getUser(client)

        if (!user)
            this.userSocketMap.delete(user.userID);
    }

    sendNotification(userID: string, message: any): void { 

        const userSocket = this.userSocketMap.get(userID);

        if (!userSocket)
            return;

        userSocket.emit('notification', message);
    }

    private async getUser(client: Socket): Promise<any> {
    
        const headers = client.handshake.headers
        const token = await this.extractTokenFromHeader(headers)

        if (!token) {
            return false;
        }
    
        const validateToken = await this.authService.validateToken({ token });
    
        if (validateToken.error) {
            return false;
        }
        
        const data = validateToken.data
        const user = { userID: data.userID, username: data.username, email: data.email, socketID: client.id }
    
        return user;
    }
  
    private async extractTokenFromHeader(headers: any): Promise<string | undefined> {
  
        if (typeof headers === "undefined")
            return undefined;
    
        const [type, token] = headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      
    }
}