import { v4 as uuid } from 'uuid';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '../INotificationsRepository';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: uuid(),
      content,
      recipient_id,
      read: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.notifications.push(notification);

    return notification;
  }
}
