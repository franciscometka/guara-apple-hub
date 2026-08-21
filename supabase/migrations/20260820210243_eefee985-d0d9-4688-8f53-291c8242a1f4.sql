-- Nova categoria "Carregadores".
-- "Acessórios" passa a ser só capas e películas; carregadores, cabos, fontes e
-- adaptadores ganham categoria própria e uma pill própria no catálogo.
ALTER TABLE public.produtos DROP CONSTRAINT IF EXISTS produtos_categoria_check;

ALTER TABLE public.produtos
  ADD CONSTRAINT produtos_categoria_check
  CHECK (categoria IN ('iPhone','iPad','Apple Watch','AirPods','Mac','Acessórios','Carregadores'));
