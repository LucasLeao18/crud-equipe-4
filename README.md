# CRUD Equipe 4

Projeto acadêmico para demonstrar um fluxo completo de colaboração no GitHub: issues, board com prioridade, branches, pull requests, release e deploy automático na Vercel.

## Equipe

- [LucasLeao18](https://github.com/LucasLeao18)
- [joaoflaviolima53](https://github.com/joaoflaviolima53)
- [edsonfreitas19](https://github.com/edsonfreitas19)
- [jcbfonseca](https://github.com/jcbfonseca)

## Escopo

Aplicação web para autenticação demonstrativa e gerenciamento de tarefas (criar, visualizar, editar e excluir), com persistência no navegador.

## Funcionalidades

- Login demonstrativo com validação de nome e e-mail
- Criação, edição, conclusão e exclusão de tarefas
- Prioridades alta, média e baixa
- Persistência com `localStorage`
- Interface responsiva e recursos básicos de acessibilidade
- Testes automatizados da lógica de domínio

## Executar localmente

O projeto não exige etapa de build. Abra `index.html` em um servidor HTTP local ou execute:

```bash
npx serve .
```

Para executar os testes:

```bash
npm test
```

## Arquitetura

| Arquivo | Responsabilidade |
| --- | --- |
| `auth.js` | Login demonstrativo e sessão local |
| `app.js` | Interface e eventos do CRUD |
| `task-store.js` | Regras puras de criação, atualização e remoção |
| `styles.css` | Design responsivo |

## Fluxo de colaboração

Cada entrega nasce em uma issue, é implementada em uma branch própria e integrada por Pull Request. O projeto no GitHub organiza os itens por status e prioridade.

## Deploy

A branch `main` é publicada automaticamente na Vercel. Cada Pull Request também pode receber um preview isolado depois que a integração for autorizada.
