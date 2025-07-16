/*
  # Limpeza de produtos falsos e dados de teste

  1. Limpeza
    - Remove todos os produtos existentes (dados de teste)
    - Remove carrinho de compras
    - Remove transações de teste
    - Remove notificações antigas
    - Remove chats de teste

  2. Reset
    - Limpa dados falsos para começar com dados reais
*/

-- Limpar carrinho de compras
DELETE FROM cart_items;

-- Limpar transações de teste
DELETE FROM transactions;

-- Limpar chats de teste
DELETE FROM chats;

-- Limpar notificações antigas
DELETE FROM notifications;

-- Limpar saques de teste
DELETE FROM withdrawals;

-- Limpar produtos falsos/de teste
DELETE FROM products;

-- Reset sequences se necessário
-- (Supabase usa UUIDs, então não é necessário)

-- Log da limpeza
INSERT INTO notifications (user_id, content, type, is_read) 
SELECT id, 'Sistema limpo - dados de teste removidos', 'system', false 
FROM users 
WHERE role = 'admin';