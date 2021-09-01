import { Model } from "mongoose";
import { IMessage } from "../interface";
import MessageModel from "../models/message.model";
import { IClientChatMessage } from "../interface/events.interface";

class MessageService {
  constructor(private messageModel: Model<IMessage>) {}

  createNewMessage(data: IClientChatMessage) {
    const message = new this.messageModel(data);
    return message.save();
  }
}

export default new MessageService(MessageModel);
