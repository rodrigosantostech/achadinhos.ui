# Validação inicial — 23/10/2026

- Next.js 16.4.3, React 19.3.1 e TypeScript, com App Router.
- npm run lint, npm run typecheck e npm run build aprovados.
- Servidor Next.js de produção iniciado temporariamente para verificação HTTP.
- Com API e PostgreSQL locais ativos: página retornou HTTP 200 e conexão disponível.
- Com API desligada: página retornou HTTP 200 e indisponibilidade explícita.
- Consulta somente ao endpoint público /health/ready, feita pelo servidor Next.js com timeout.
- Nenhum token administrativo, credencial de banco ou dado de oferta artificial incluído no frontend.
- Processos de validação encerrados ao final; usar npm run dev para iniciar a UI.
- Git local e CI independentes; execução remota de GitHub Actions ainda pendente.

ESLint 9.39.5 foi fixado para respeitar os peers dos plugins import/react/jsx-a11y
incluídos no eslint-config-next atual. O npm sinaliza essa versão como sem suporte;
avaliar atualização para ESLint 10 quando os plugins declararem compatibilidade.
O ambiente deixou o postinstall opcional de unrs-resolver sem autorização; lint e build
funcionaram sem habilitá-lo. Nenhuma política global de scripts foi alterada.

Login OIDC e fluxos de ofertas, revisão e publicação ainda não estão implementados.
## Fluxo local implementado — 23/10/2026

Ofertas, detalhe, revisão e fila local substituíram os cartões Em preparação.
npm.cmd run lint, typecheck e build aprovados; as quatro telas respondem 200 com a API real.
Cadastro inválido verificado via Server Action, incluindo redirecionamento e feedback de validação.
Prévia desktop de Ofertas conferida em Edge headless.
A suíte backend passou 34 testes, incluindo o fluxo persistido em PostgreSQL e concorrência.
Login adiado; coleta Shopee e envio Telegram continuam pendentes.
O banco da aplicação permanece sem ofertas artificiais.

## Simulação local — 23/10/2026

- Botão Simular agora para agendamentos locais elegíveis e flag habilitada na API.
- Nova rota /publicacoes/[id]/simulacao com prévia em texto React, sem renderização de HTML externo.
- Estado Simulada e avisos de ausência de envio; link de produto sem afirmar afiliação.
- Revalidação do painel após ação e redirecionamento para o recibo persistido.
- Lint, TypeScript e build de produção isolado aprovados.
- Servidor atualizado na porta 3000 após validação temporária na porta 3001.
- Página Publicações confirmou a nova orientação; Ofertas/Revisão também responderam HTTP 200.
- Backend: 98 testes com PostgreSQL real aprovados, incluindo fluxo local e concorrência.
- Nenhuma oferta de teste foi criada no banco da aplicação, nem houve contato com Telegram.