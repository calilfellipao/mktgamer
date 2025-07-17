/*
  # Limpeza completa de dados falsos e de teste

  1. Limpeza de Dados
    - Remove produtos de teste/falsos
    - Remove usuários com nomes automáticos
    - Remove transações de teste
    - Remove notificações antigas
    - Remove itens do carrinho órfãos

  2. Validações
    - Adiciona constraints para evitar dados inválidos
    - Bloqueia usernames automáticos
*/

-- Remover produtos falsos/de teste
DELETE FROM products 
WHERE 
  title ILIKE '%teste%' OR 
  title ILIKE '%test%' OR 
  title ILIKE '%demo%' OR 
  title ILIKE '%fake%' OR 
  description ILIKE '%teste%' OR
  description ILIKE '%test%' OR
  seller_id IN (
    SELECT id FROM users 
    WHERE username ILIKE '%test%' OR username ILIKE '%demo%' OR username ILIKE '%fake%'
  );

-- Remover usuários com nomes automáticos/teste
DELETE FROM users 
WHERE 
  username ILIKE '%test%' OR 
  username ILIKE '%demo%' OR 
  username ILIKE '%fake%' OR 
  username ILIKE '%123%' OR 
  username ILIKE '%asd%' OR
  username ILIKE '%user%' OR
  username ~ '^[a-z]+[0-9]+$' OR -- padrão user123, test456, etc
  LENGTH(username) < 3;

-- Remover transações órfãs (sem produto ou usuário válido)
DELETE FROM transactions 
WHERE 
  product_id NOT IN (SELECT id FROM products) OR
  buyer_id NOT IN (SELECT id FROM users) OR
  seller_id NOT IN (SELECT id FROM users);

-- Remover itens do carrinho órfãos
DELETE FROM cart_items 
WHERE 
  product_id NOT IN (SELECT id FROM products) OR
  user_id NOT IN (SELECT id FROM users);

-- Remover notificações órfãs
DELETE FROM notifications 
WHERE 
  user_id NOT IN (SELECT id FROM users);

-- Remover chats órfãos
DELETE FROM chats 
WHERE 
  buyer_id NOT IN (SELECT id FROM users) OR
  seller_id NOT IN (SELECT id FROM users) OR
  product_id NOT IN (SELECT id FROM products);

-- Remover saques órfãos
DELETE FROM withdrawals 
WHERE 
  user_id NOT IN (SELECT id FROM users);

-- Adicionar constraint para evitar usernames automáticos (opcional)
-- ALTER TABLE users ADD CONSTRAINT check_username_quality 
-- CHECK (
--   username !~ '^[a-z]+[0-9]+$' AND 
--   username NOT ILIKE '%test%' AND 
--   username NOT ILIKE '%demo%' AND 
--   LENGTH(username) >= 3
-- );

-- Resetar sequences se necessário
-- SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1));
-- SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));

-- Atualizar estatísticas das tabelas
ANALYZE products;
ANALYZE users;
ANALYZE transactions;
ANALYZE cart_items;
ANALYZE notifications;