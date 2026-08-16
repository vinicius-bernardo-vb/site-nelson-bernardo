# Site de Imóveis — Nelson Bernardo Júnior

React + Vite + Tailwind + Supabase. Vitrine pública de imóveis com botão de WhatsApp e painel administrativo protegido.

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com suas chaves do Supabase
npm run dev
```

## Variáveis de ambiente (`.env`)

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publishable-anon
VITE_WHATSAPP_NUMBER=5511993889470
```

⚠️ Use sempre a chave **anon/publishable**. A `service_role`/`secret` nunca deve entrar no frontend — ela ignora o RLS.

## Criando o usuário admin

O painel `/admin` usa Supabase Auth (e-mail + senha). Crie o usuário do Nelson em:

**Supabase Dashboard → Authentication → Users → Add user**

Só quem tiver login criado ali consegue entrar no painel.

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/` — é isso que sobe pro servidor (EasyPanel, Vercel, Netlify, etc).

## Deploy no seu VPS (EasyPanel)

1. Suba este projeto num repositório no GitHub.
2. No EasyPanel, crie um app do tipo "App" apontando pro repo, com build command `npm run build` e diretório de output `dist`.
3. Configure as 3 variáveis de ambiente acima nas configurações do app.
4. Como é uma SPA (React Router), configure o fallback de rotas pra `index.html` (mesma configuração que você já usa nos outros projetos Lovable/React no EasyPanel).

## Estrutura

```
src/
  lib/
    supabase.js       -> client do Supabase + helpers (formatPrice, whatsappLink)
    useAuth.js         -> hook de sessão do Supabase Auth
  components/
    Header.jsx, Footer.jsx, PropertyCard.jsx, Filters.jsx, WhatsAppFloatingButton.jsx, ProtectedRoute.jsx
  pages/
    Home.jsx            -> vitrine pública com filtros
    PropertyDetail.jsx   -> página de detalhe do imóvel
    admin/
      AdminLogin.jsx
      AdminDashboard.jsx     -> lista, busca, toggle ativo/inativo, exclusão
      AdminPropertyForm.jsx  -> criar/editar imóvel + upload de fotos
```

## Rotas

- `/` — vitrine pública
- `/imovel/:id` — detalhe do imóvel
- `/admin/login` — login
- `/admin` — dashboard (protegido)
- `/admin/imoveis/novo` — cadastrar imóvel (protegido)
- `/admin/imoveis/:id` — editar imóvel (protegido)
