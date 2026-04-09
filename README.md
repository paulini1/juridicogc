# Assessoria Jurídica — Câmara Municipal de General Câmara/RS

Sistema de pareceres jurídicos com RAG (busca semântica em PDFs) e IA.

## Deploy no Vercel

### 1. Suba para o GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 2. Configure no Vercel

1. Acesse [vercel.com](https://vercel.com) e importe o repositório do GitHub
2. Vá em **Settings → Environment Variables**
3. Adicione a variável:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-SUA_CHAVE_AQUI`
4. Clique em **Deploy**

### Estrutura

```
├── index.html        ← Frontend (sem API key)
├── api/
│   └── chat.js       ← Serverless proxy (usa env var)
├── vercel.json       ← Configuração de rotas
└── .gitignore
```

### Como funciona

- O frontend envia as requisições para `/api/chat`
- A serverless function (`api/chat.js`) adiciona a API key e repassa para a API da Anthropic
- A chave **nunca aparece** no código do frontend nem no repositório GitHub
- O streaming funciona normalmente através do proxy

### Desenvolvimento local

Para testar localmente, instale a CLI do Vercel:

```bash
npm i -g vercel
vercel env pull        # baixa as env vars do projeto
vercel dev             # roda localmente na porta 3000
```
