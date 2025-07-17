import { supabase } from '../lib/supabase';
import { ErrorHandler } from './errorHandler';

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  transaction_id: string;
  rating: number; // 1-5 stars
  comment: string;
  created_at: string;
  reviewer?: {
    username: string;
    avatar_url: string;
  };
}

export class ReviewService {
  // Criar avaliação
  static async createReview(reviewData: {
    reviewer_id: string;
    reviewed_user_id: string;
    transaction_id: string;
    rating: number;
    comment: string;
  }) {
    return ErrorHandler.withRetry(async () => {
      console.log('⭐ Criando avaliação...');
      
      // Verificar se já existe avaliação para esta transação
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('transaction_id', reviewData.transaction_id)
        .eq('reviewer_id', reviewData.reviewer_id)
        .single();

      if (existingReview) {
        throw new Error('Você já avaliou esta transação');
      }

      // Verificar se a transação foi concluída
      const { data: transaction } = await supabase
        .from('transactions')
        .select('status, buyer_id, seller_id')
        .eq('id', reviewData.transaction_id)
        .single();

      if (!transaction || transaction.status !== 'completed') {
        throw new Error('Só é possível avaliar transações concluídas');
      }

      // Verificar se o usuário participou da transação
      if (transaction.buyer_id !== reviewData.reviewer_id && transaction.seller_id !== reviewData.reviewer_id) {
        throw new Error('Você não pode avaliar esta transação');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(username, avatar_url)
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao criar avaliação:', error);
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      // Atualizar média do usuário avaliado
      await this.updateUserRating(reviewData.reviewed_user_id);

      console.log('✅ Avaliação criada');
      return data;
    });
  }

  // Buscar avaliações de um usuário
  static async getUserReviews(userId: string) {
    return ErrorHandler.withRetry(async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(username, avatar_url)
        `)
        .eq('reviewed_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(ErrorHandler.handleSupabaseError(error));
      }

      return data || [];
    });
  }

  // Calcular e atualizar média de avaliações do usuário
  static async updateUserRating(userId: string) {
    return ErrorHandler.withRetry(async () => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_user_id', userId);

      if (!reviews || reviews.length === 0) {
        return;
      }

      const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      const roundedAverage = Math.round(average * 10) / 10; // Arredondar para 1 casa decimal

      await supabase
        .from('users')
        .update({ 
          reputation: roundedAverage,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      console.log(`✅ Média atualizada para usuário ${userId}: ${roundedAverage}`);
    });
  }

  // Buscar estatísticas de avaliações
  static async getUserRatingStats(userId: string) {
    return ErrorHandler.withRetry(async () => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_user_id', userId);

      if (!reviews || reviews.length === 0) {
        return {
          average: 0,
          total: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const total = reviews.length;
      const average = reviews.reduce((sum, review) => sum + review.rating, 0) / total;
      
      const distribution = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        average: Math.round(average * 10) / 10,
        total,
        distribution
      };
    });
  }
}