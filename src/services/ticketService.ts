import { supabase } from '../lib/supabase';
import { ErrorHandler } from './errorHandler';

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  };
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

export class TicketService {
  // Criar novo ticket
  static async createTicket(ticketData: {
    user_id: string;
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    return ErrorHandler.withRetry(async () => {
      console.log('🎫 Criando ticket...');
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ...ticketData,
          status: 'new'
        }])
        .select(`
          *,
          user:users(id, username, email, avatar_url)
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao criar ticket:', error);
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      // Criar primeira mensagem
      await supabase
        .from('ticket_messages')
        .insert([{
          ticket_id: data.id,
          sender_id: ticketData.user_id,
          message: ticketData.description,
          is_admin: false
        }]);

      console.log('✅ Ticket criado:', data.id);
      return data;
    });
  }

  // Buscar tickets do usuário
  static async getUserTickets(userId: string) {
    return ErrorHandler.withRetry(async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          user:users(id, username, email, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      return data || [];
    });
  }

  // Buscar todos os tickets (admin)
  static async getAllTickets() {
    return ErrorHandler.withRetry(async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          user:users(id, username, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      return data || [];
    });
  }

  // Buscar mensagens do ticket
  static async getTicketMessages(ticketId: string) {
    return ErrorHandler.withRetry(async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select(`
          *,
          sender:users(username, avatar_url)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      return data || [];
    });
  }

  // Enviar mensagem no ticket
  static async sendMessage(messageData: {
    ticket_id: string;
    sender_id: string;
    message: string;
    is_admin: boolean;
  }) {
    return ErrorHandler.withRetry(async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([messageData])
        .select(`
          *,
          sender:users(username, avatar_url)
        `)
        .single();

      if (error) {
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      // Atualizar status do ticket para "in_progress" se for nova mensagem
      await supabase
        .from('tickets')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', messageData.ticket_id);

      return data;
    });
  }

  // Atualizar status do ticket
  static async updateTicketStatus(ticketId: string, status: 'new' | 'in_progress' | 'resolved' | 'closed') {
    return ErrorHandler.withRetry(async () => {
      const { data, error } = await supabase
        .from('tickets')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      return data;
    });
  }
}