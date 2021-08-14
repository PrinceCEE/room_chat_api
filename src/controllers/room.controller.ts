import { Req, Res, Next, IResponse, IUser } from "../interface";
import { UnauthorisedError } from "../errors";
import roomService from "../services/room.service";
import { CreateRoomDto } from "../dtos";

export const getAllRooms = async (req: Req, res: Res, next: Next) => {
  const rooms = await roomService.getAllRooms();
  const response: IResponse = {
    success: true,
    data: rooms,
  };
  res.json(response);
};

export const createRoom = async (req: Req, res: Res, next: Next) => {
  const body: CreateRoomDto = req.body,
    user = req.user as IUser;

  const room = await roomService.createRoom(body.name, user.username);
  const response: IResponse = {
    success: true,
    data: room
  };
  res.json(response);
};

export const leaveRoom = async (req: Req, res: Res, next: Next) => {
  const { roomName } = req.params,
    user = req.user as IUser;
  
  await roomService.leaveRoom(roomName, user.id);
  const response: IResponse = {
    success: true,
    data: `You successfully left ${roomName}`
  };
  res.json(response);
};

export const joinRoom = async (req: Req, res: Res, next: Next) => {
  const { roomName } = req.params,
    user = req.user as IUser;

  const room = await roomService.joinRoom(roomName, user.id);
  const response: IResponse = {
    success: true,
    data: room,
  };
  res.json(response);
}

export const deleteRoom = async (req: Req, res: Res, next: Next) => {
  const { roomName } = req.params,
    user = req.user as IUser;
  
  await roomService.deleteRoom(roomName);
  const response: IResponse = {
    success: true,
    data: `Successfully delete ${roomName}`
  }
  res.json(response);
};