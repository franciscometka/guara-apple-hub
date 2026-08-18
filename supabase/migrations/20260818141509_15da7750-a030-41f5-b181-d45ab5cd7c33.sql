CREATE POLICY "Fotos de produtos visiveis para todos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'produtos-fotos');

CREATE POLICY "Autenticados enviam fotos de produtos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'produtos-fotos');

CREATE POLICY "Autenticados atualizam fotos de produtos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'produtos-fotos')
  WITH CHECK (bucket_id = 'produtos-fotos');

CREATE POLICY "Autenticados excluem fotos de produtos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'produtos-fotos');