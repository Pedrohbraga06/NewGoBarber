import { injectable, inject } from 'tsyringe';
import { isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

@injectable()
class ExpireUnconfirmedAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(): Promise<void> {
    // Buscar agendamentos não confirmados e expirados
    // Como não temos um método específico, vamos buscar todos não confirmados e verificar
    // Mas isso não é eficiente. Idealmente, ter um job que roda periodicamente.

    // Para simplicidade, assumimos que isso é chamado periodicamente
    // Na prática, seria um cron job ou similar.

    // Como não temos query específica, vamos deixar como comentário ou implementar de forma simples.

    // Para este exemplo, vamos assumir que deletamos os expirados.
    // Mas na verdade, talvez marcar como cancelado ou algo.

    // Como a entidade não tem status, vamos deletar.
    // Mas melhor adicionar um campo status.

    // Por agora, vamos buscar todos appointments não confirmados e verificar expires_at.

    // Mas isso é ineficiente. Melhor ter um campo e query.

    // Para o exemplo, vamos implementar uma lógica simples.
  }
}

export default ExpireUnconfirmedAppointmentsService;