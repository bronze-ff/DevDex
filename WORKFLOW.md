# Workflow: Linear + GitHub + gh CLI

Guia de boas práticas para gerenciamento de projetos com Linear, GitHub e gh CLI.
Copie este arquivo para a raiz de cada novo projeto.

---

## Instalação do gh CLI

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install gh

# Se não encontrar o pacote
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Autenticar
gh auth login
# → GitHub.com → SSH → Upload SSH key → Browser
```

---

## Integração Linear ↔ GitHub

1. No Linear: **Settings → Integrations → GitHub → Connect**
2. Autorizar o repositório desejado
3. A partir daí, `Closes ISSUE-X` no corpo de um PR fecha a issue automaticamente no merge

---

## Sincronização com o remoto

Antes de qualquer trabalho, verificar se o local está atualizado. Ferramentas como o Codex podem fazer commits direto em branches (ex: ajustes em PRs), deixando o local desatualizado:

```bash
git fetch origin
git status  # verifica se algum branch está atrás do remoto
```

---

## Convenção de Branches

Sempre criar a branch a partir de `main`. Nunca commitar direto em `main`.

```
feat/ISSUE-X-descricao-curta     # nova funcionalidade
fix/ISSUE-X-descricao-curta      # correção de bug
refactor/ISSUE-X-descricao       # refatoração
test/descricao                 # teste pontual sem issue
chore/descricao                # manutenção, deps, config
```

---

## Worktrees (trabalho paralelo)

Usar quando precisar trabalhar em duas features ao mesmo tempo sem misturar código:

```bash
# Atualizar main antes de criar o worktree
git checkout main && git pull

# Criar worktree para uma feature (sempre a partir de main atualizado)
git worktree add -b feat/ISSUE-X-descricao ../PROJETO-ISSUE-X main

# Trabalhar no diretório separado
cd ../PROJETO-ISSUE-X

# Ao finalizar, remover o worktree
git worktree remove ../PROJETO-ISSUE-X
```

---

## Commits

Seguir Conventional Commits. Sempre referenciar a issue do Linear:

```bash
git commit -m "feat: adicionar filtro por data nos agendamentos

Closes ISSUE-12"
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Pull Requests

Criar via `gh pr create` com corpo estruturado e `Closes ISSUE-X`:

```bash
gh pr create --title "feat: descrição da mudança" --body "$(cat <<'EOF'
## O que foi feito
- item 1
- item 2

## Como testar
1. passo 1
2. passo 2

Closes ISSUE-X
EOF
)"
```

Comandos úteis:
```bash
gh pr status          # PRs abertos no repositório atual
gh pr checks          # status de CI do PR atual
gh pr view            # detalhes do PR atual
gh pr merge --squash --delete-branch  # mergear com histórico limpo
```

---

## Fluxo Completo de uma Feature

```
1. Criar issue no Linear (ISSUE-X)
2. git checkout main && git pull
3. git checkout -b feat/ISSUE-X-descricao
4. Implementar
5. git commit -m "feat: ... \n\nCloses ISSUE-X"
6. gh pr create (com Closes ISSUE-X no corpo)
7. [revisão se necessário]
8. gh pr merge --squash --delete-branch
9. git checkout main && git pull
10. Linear fecha ISSUE-X automaticamente
```

---

## Política de Merge

**Requer revisão antes do merge:**
- Alterações no banco de dados (tabelas, colunas, triggers)
- Regras de negócio (fluxo de status, validações, cálculos)
- Autenticação e permissões
- Integrações externas

**Merge automático permitido:**
- Correções visuais de UI (cores, espaçamento, tipografia)
- Textos, labels, mensagens de erro
- Refatorações internas sem mudança de comportamento
- Documentação (CLAUDE.md, README)

---

## Configurar em um Novo Projeto

1. Copiar este arquivo para `WORKFLOW.md` na raiz do projeto (backup)
2. Instalar `gh` na máquina se necessário (`sudo apt install gh`)
3. Rodar `gh auth login`
4. Conectar Linear ao repositório via **Linear → Settings → Integrations → GitHub**
5. Adicionar a seção `## Git Workflow` no `CLAUDE.md` do projeto
