---
name: ci-pipeline-debug
description: Diagnostica falhas na pipeline do GitHub Actions (playwright.yml) deste repositório, orienta o cadastro seguro de secrets, e configura/mantém a criação automática de issues no Jira quando os testes falham. Use quando a pipeline estiver quebrando, quando precisar adicionar/rotacionar secrets, ou quando for mexer na integração com Jira.
---

# Debug de pipeline CI/CD (Playwright + GitHub Actions + Jira)

Skill para este repositório. Cobre três frentes: diagnosticar falhas na esteira,
cadastrar secrets com segurança, e manter a integração que cria issues no Jira
quando os testes falham.

## 1. Diagnosticar pipeline falhando

1. Ver o histórico recente:
   ```
   gh run list --limit 5
   ```
2. Ver o resumo da run que falhou (mostra qual step quebrou):
   ```
   gh run view <run-id>
   ```
3. Ver o log completo do step que falhou:
   ```
   gh run view <run-id> --log-failed
   ```
   - Se der `HTTP 403: Must have admin rights to Repository`, o token do `gh`
     provavelmente expirou — rode `gh auth login -h github.com` (fluxo de device
     code, veja seção 4) antes de insistir em permissões.
4. Causas raiz mais comuns já vistas neste repo:
   - **`page.goto: url: expected string, got undefined`** → variável de ambiente
     não chegou no CI. O `.env` local está no `.gitignore` de propósito (não deve
     ir pro repo), então `BASE_URL`, `TEST_EMAIL_CADASTRADO` etc. só existem no
     CI se estiverem cadastradas como Secrets e referenciadas no `env:` do step
     em `.github/workflows/playwright.yml`.
   - Testes realmente quebrando (regressão de verdade) → não é problema de CI,
     é problema no app/teste mesmo.

## 2. Cadastrar/rotacionar secrets com segurança

Regra de ouro: **o valor de um secret/token nunca deve aparecer em texto na
tela nem em prints compartilhados**. Se isso acontecer, considere o valor
vazado e revogue/gere outro imediatamente.

- Prefira o modo interativo (sem `--body`), que não ecoa o valor:
  ```
  gh secret set NOME_DO_SECRET --repo Never1Surrender/automacao-playwright
  ```
  Cola o valor, aperta Enter. Não precisa printar essa etapa.
- Só use `--body "valor"` para coisas não sigilosas (ex: e-mail, URL pública).
- Conferir o que já está cadastrado (não mostra valores, só nomes/datas):
  ```
  gh secret list --repo Never1Surrender/automacao-playwright
  ```
- Secrets usados hoje neste projeto:
  - `BASE_URL`, `TEST_EMAIL_CADASTRADO`, `TEST_SENHA_CADASTRADA`,
    `TEST_EMAIL_INVALIDO`, `TEST_SENHA_INCORRETA` (espelham o `.env` local)
  - `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_BASE_URL`, `JIRA_PROJECT_KEY`
    (integração Jira, ver seção 3)

## 3. Integração: criar issue no Jira quando os testes falham

Step no final do `.github/workflows/playwright.yml`, condicionado a
`if: failure()`, que faz um `POST` para a API REST v3 do Jira
(`/rest/api/3/issue`) usando Basic Auth (`JIRA_EMAIL:JIRA_API_TOKEN`).

### Pré-requisitos ao trocar de projeto Jira

Se o projeto Jira mudar (key diferente, ou projeto recriado), antes de tocar
no workflow:

1. **Confirme a key exata** do novo projeto (aparece na URL do board:
   `.../jira/software/projects/<KEY>/boards/1`, ou no ID das issues `<KEY>-1`).
2. **Confirme os issue types válidos** desse projeto — nem todo projeto tem
   "Bug" (projetos tipo "negócios" costumam ter só Tarefa/Epic/etc). Consulte:
   ```
   curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
     "$JIRA_BASE_URL/rest/api/3/issue/createmeta?projectKeys=<KEY>&expand=projects.issuetypes"
   ```
   (rode isso localmente com suas próprias credenciais, não cole o token na
   conversa) — ou simplesmente abra a prévia do template na hora de criar o
   projeto no Jira e olhe a lista de "Work types".
3. Atualize os secrets `JIRA_PROJECT_KEY` (e `JIRA_BASE_URL` se mudou de site)
   e o campo `"issuetype": { "name": "..." }` no workflow para bater com o
   tipo disponível.

### Diagnóstico de erros comuns dessa integração

- **401 "Client must be authenticated"** → token inválido ou nunca usado. O
  Jira só mostra o valor do token uma vez, na criação — se foi fechado sem
  copiar, é preciso revogar e gerar outro. Teste isolado (rodar você mesmo,
  fora do CI, sem compartilhar o resultado):
  ```
  curl -s -o /dev/null -w "%{http_code}\n" -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
    "$JIRA_BASE_URL/rest/api/3/myself"
  ```
  Deve retornar `200`.
- **400 "target project doesn't exist or you don't have permission"** →
  key errada, ou o projeto foi movido pra lixeira/excluído.
- **400 "Especifique algum tipo de item válido"** → o `issuetype.name` usado
  no payload não existe nesse projeto. Ver passo 2 acima.

### Testar a integração de ponta a ponta

Só faça isso combinando com o usuário antes (quebra um teste de propósito):

1. Editar temporariamente um assert em qualquer arquivo de `tests/*.spec.js`
   para forçar falha (ex: trocar o regex esperado por algo que nunca vai
   bater).
2. Commit + push, acompanhar com `gh run watch <run-id>`.
3. Conferir no log do step "Criar issue no Jira em caso de falha" se retornou
   `201` e a key da issue criada.
4. Reverter o assert quebrado e dar push de novo.

## Notas específicas deste repositório

- Runner de pacotes é **Bun**, não npm/yarn.
- Só o projeto Chromium roda no CI (`bunx playwright test --project=chromium`).
- Owner do repo no GitHub: `Never1Surrender`. Repo: `automacao-playwright`.
