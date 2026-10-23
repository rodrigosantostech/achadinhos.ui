# Achadinhos UI

Frontend independente em Next.js/TypeScript. A API e o Worker estão na pasta API do workspace.

## Desenvolvimento

Node.js 24. Na pasta UI:

~~~powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
~~~

Abra http://localhost:3000. API_BASE_URL é lida somente pelo servidor Next.js e usa
http://localhost:8080 por padrão. Na pasta API, aplique as migrations e inicie o servidor:

~~~powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/dev.ps1 -Target Migrate
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/dev.ps1 -Target Api
~~~

O script Api habilita acesso local sem login em Development, restrito a loopback.
Não é necessário configurar IdP para esse fluxo. Login ficou para uma entrega posterior.
Requisições à API e mutações são feitas no servidor; não há acesso direto ao PostgreSQL ou segredos no browser.

## Funcionalidades

- Início com disponibilidade da API/banco e navegação.
- /ofertas: busca, filtro, paginação e cadastro manual.
- /ofertas/{id}: detalhe, histórico de preços e decisões, aprovação/rejeição e agendamento.
- /revisao: ofertas a revisar por padrão; rejeição exige justificativa.
- /publicacoes: fila, cancelamento e ação Simular agora.
- /publicacoes/{id}/simulacao: prévia local com auditoria e indicação de que nenhuma mensagem foi enviada.

O cadastro usa BRL. Datas de agendamento são informadas em UTC−3.
Preço e estoque de cadastros manuais não são verificados na loja.
A coleta Shopee e o envio Telegram seguem pendentes: a fila não envia nem marca registros como publicados.
Falhas de API são exibidas; não são substituídas por dados fictícios.

## Validação

~~~powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd start
~~~

CI própria em .github/workflows/ci.yaml. Sem dependências novas nesta entrega.

## Simulação sem Telegram

Cadastre uma oferta HTTPS, aprove e agende. Na fila, clique **Simular agora**.
O resultado fica marcado como simulado e a oferta retorna para aprovada, permitindo novo agendamento.
Nenhum ID Telegram é inventado, e nenhum token é necessário.
A API precisa da migration LocalPublicationSimulation e de Simulation:Enabled=true em Development;
o script scripts/dev.ps1 -Target Api do backend já configura a flag.
Envio real permanece desligado. O simulador não habilita ou testa a conexão Telegram.

Para validar um build isolado, configure NEXT_DIST_DIR=.local/simulation-build antes de npm run build.
Use o mesmo valor ao iniciar esse build com npm start; o desenvolvimento normal continua usando .next.