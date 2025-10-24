# 💪 Fitness Front - Frontend

Interface web para o sistema de gerenciamento de academias, permitindo que instrutores criem fichas de treino e alunos acompanhem seu progresso.

## 🚀 Como Rodar

### Opção 1: Clone e Instalação Local

```bash
git clone <url-do-repositorio>
cd fitness-front

npm install

cp .env.example .env

npm run dev
```

O frontend estará disponível em `http://localhost:8080`

### Opção 2: Docker

**Executar apenas o frontend:**
```bash
docker build -t fitness-front .
docker run -p 80:80 fitness-front
```

O frontend estará disponível em `http://localhost`

## ⚙️ Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `fitness-front/`:

```bash
API_URL=http://localhost:3000
```
⚠️ **Importante:** Após alterar o `.env`, você precisa:
- **Desenvolvimento:** Reiniciar o servidor (`Ctrl+C` e `npm run dev` novamente)
- **Docker:** Reconstruir a imagem (`docker-compose up --build`)

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3** - Framework progressivo para construção de interfaces
- **Vue Router** - Roteamento oficial do Vue.js
- **Pinia** - Gerenciamento de estado (store)
- **Axios** - Cliente HTTP para requisições à API
- **Vuetify** - Biblioteca de componentes Material Design
- **ApexCharts** - Gráficos e visualização de dados
- **Font Awesome** - Ícones
- **Lucide Vue** - Ícones modernos

## 📦 Estrutura do Projeto

```
fitness-front/
├── src/
│   ├── assets/          # Imagens e arquivos estáticos
│   ├── components/      # Componentes reutilizáveis
│   ├── router/          # Configuração de rotas
│   ├── store/           # Gerenciamento de estado (Pinia)
│   ├── views/           # Páginas da aplicação
│   ├── api.js           # Configuração do Axios
│   ├── config.js        # Configurações gerais
│   ├── App.vue          # Componente raiz
│   └── main.js          # Arquivo de entrada
├── public/              # Arquivos públicos
├── .env                 # Variáveis de ambiente
└── package.json         # Dependências e scripts
```

## 🎨 Funcionalidades

- **Dashboard do Instrutor:** Gerenciamento de alunos e fichas de treino
- **Dashboard do Aluno:** Visualização de treinos e acompanhamento de progresso
- **Gestão de Exercícios:** Catálogo completo com descrições e imagens
- **Fichas de Treino:** Criação com divisões (A, B, C, etc.) e exercícios personalizados
- **Modo Claro/Escuro:** Interface adaptável às preferências do usuário
- **Responsivo:** Funciona em desktop, tablet e mobile 🚧 Coming Soon

## 📝 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run lint     # Executa linter de código
```

## 🤝 Autores

- Bernardo Villanova de Santana
- Rodrigo Carlos dos Santos Neto
