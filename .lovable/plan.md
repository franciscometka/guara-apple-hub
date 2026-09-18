# Substituir o modelo 3D do Hero

## Alterações
- Comprimir o GLB enviado com Meshopt, preservando materiais e texturas.
- Substituir o modelo atual mantendo o caminho `/models/iphone.glb`, sem alterar animação ou controles.
- Ajustar somente a limpeza interna da cena se o novo arquivo tiver uma estrutura diferente do antigo.

## Validação
- Comparar tamanho, extensões, materiais, texturas e geometria antes e depois da compressão.
- Abrir a home em desktop e mobile, confirmar enquadramento e rotação e verificar o console.
- Executar a verificação final do projeto.
