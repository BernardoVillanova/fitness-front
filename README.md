# 📚 Documentação do Sistema de Gestão de Academias - Frontend

## 📑 Sumário

### 1. [🎯 Sobre o Projeto](#-sobre-o-projeto)

### 2. [🏗️ Arquitetura do Sistema](#-arquitetura-do-sistema)
- 2.1 [Stack Tecnológico](#stack-tecnológico)
- 2.2 [Estrutura de Pastas](#estrutura-de-pastas)

### 3. [🔐 Sistema de Autenticação](#-sistema-de-autenticação)
- 3.1 [Fluxo de Autenticação](#fluxo-de-autenticação)
- 3.2 [Store de Autenticação](#store-de-autenticação-storeauthjs)

### 4. [👥 Perfis de Usuário](#-perfis-de-usuário)
- 4.1 [Instrutor](#1-instrutor-instructor)
- 4.2 [Aluno](#2-aluno-student)

### 5. [🏋️ Módulos Principais](#-módulos-principais)
- 5.1 [Gestão de Academias](#1-gestão-de-academias)
- 5.2 [Gestão de Equipamentos](#2-gestão-de-equipamentos)
- 5.3 [Gestão de Exercícios](#3-gestão-de-exercícios)
- 5.4 [Planos de Treino](#4-planos-de-treino)
- 5.5 [Execução de Treino](#5-execução-de-treino-aluno)
- 5.6 [Progresso Físico](#6-progresso-físico)

### 6. [🎨 Sistema de Temas](#-sistema-de-temas)
- 6.1 [Implementação](#implementação)
- 6.2 [Variáveis CSS](#variáveis-css)

### 7. [🔔 Sistema de Notificações](#-sistema-de-notificações)
- 7.1 [Tipos de Notificação](#tipos-de-notificação)
- 7.2 [Uso e Exemplos](#uso)

### 8. [📊 Dashboard e Métricas](#-dashboard-e-métricas)
- 8.1 [Dashboard do Instrutor](#dashboard-do-instrutor)
- 8.2 [Dashboard do Aluno](#dashboard-do-aluno)

### 9. [🛠️ Componentes Reutilizáveis](#-componentes-reutilizáveis)
- 9.1 [EmptyState.vue](#emptystatevue)
- 9.2 [ConfirmationModal.vue](#confirmationmodalvue)
- 9.3 [CategoryFilter.vue](#categoryfiltervue)
- 9.4 [ContentSection.vue](#contentsectionvue)

### 10. [🔌 Integração com API](#-integração-com-api)
- 10.1 [Configuração Base](#configuração-base)
- 10.2 [Endpoints Principais](#endpoints-principais)

### 11. [🎭 Máscaras de Input](#-máscaras-de-input)

### 12. [📱 Responsividade](#-responsividade)
- 12.1 [Breakpoints](#breakpoints)
- 12.2 [Componentes Adaptáveis](#componentes-adaptáveis)

### 13. [🚀 Performance e Otimizações](#-performance-e-otimizações)
- 13.1 [Lazy Loading de Rotas](#lazy-loading-de-rotas)
- 13.2 [Computed Properties](#computed-properties)
- 13.3 [Debounce em Pesquisas](#debounce-em-pesquisas)
- 13.4 [Imagens Otimizadas](#imagens-otimizadas)

### 14. [🧪 Tratamento de Erros](#-tratamento-de-erros)
- 14.1 [Try-Catch Global](#try-catch-global)
- 14.2 [Validação de Formulários](#validação-de-formulários)
- 14.3 [Tratamento de Upload](#tratamento-de-upload)

### 15. [🔒 Segurança](#-segurança)
- 15.1 [Proteção de Rotas](#proteção-de-rotas)
- 15.2 [Sanitização de Inputs](#sanitização-de-inputs)
- 15.3 [CORS e Headers](#cors-e-headers)

### 16. [📦 Build e Deploy](#-build-e-deploy)
- 16.1 [Desenvolvimento](#desenvolvimento)
- 16.2 [Produção](#produção)
- 16.3 [Variáveis de Ambiente](#variáveis-de-ambiente)

### 17. [🐛 Debugging](#-debugging)
- 17.1 [Vue DevTools](#vue-devtools)
- 17.2 [Console Logs Estratégicos](#console-logs-estratégicos)

### 18. [📚 Convenções de Código](#-convenções-de-código)
- 18.1 [Nomenclatura](#nomenclatura)
- 18.2 [Estrutura de Componente Vue](#estrutura-de-componente-vue)

### 19. [🎓 Boas Práticas Implementadas](#-boas-práticas-implementadas)

### 20. [📖 Recursos Adicionais](#-recursos-adicionais)
- 20.1 [Documentações Oficiais](#documentações-oficiais)
- 20.2 [Bibliotecas Utilizadas](#bibliotecas-utilizadas)

### 21. [📝 Licença](#-licença)

---

## 🎯 Sobre o Projeto

Sistema completo para gestão de academias, instrutores, alunos e planos de treino, desenvolvido com Vue.js 3 e integração com backend MongoDB.

---

## 🏗️ Arquitetura do Sistema

### **Stack Tecnológico**

- **Framework:** Vue.js 3 (Composition API)
- **Gerenciamento de Estado:** Pinia
- **Roteamento:** Vue Router
- **Requisições HTTP:** Axios
- **Estilização:** CSS3 com Scoped Styles
- **Ícones:** FontAwesome 6
- **Máscaras de Input:** vue-the-mask

### **Estrutura de Pastas**

```
fitness-front/
├── public/
│   └── index.html
├── src/
│   ├── assets/          # Recursos estáticos (imagens, fontes)
│   ├── components/      # Componentes reutilizáveis
│   ├── router/          # Configuração de rotas
│   ├── store/           # Stores Pinia (auth, theme)
│   ├── views/           # Páginas/Views principais
│   ├── api.js           # Configuração Axios
│   ├── App.vue          # Componente raiz
│   └── main.js          # Entry point
├── package.json
└── vue.config.js
```

---

## 🔐 Sistema de Autenticação

### **Fluxo de Autenticação**

1. **Login/Registro:**
   - Usuário faz login via `/login`
   - Backend retorna token JWT e dados do usuário
   - Token armazenado em `sessionStorage`
   - Redirecionamento baseado no tipo de usuário (role)

2. **Proteção de Rotas:**
   - Middleware de autenticação no Vue Router
   - Verificação de token antes de acessar rotas protegidas
   - Redirecionamento automático para login se não autenticado

3. **Store de Autenticação (`store/auth.js`):**
```javascript
// Estado
- user: { id, name, email, role, instructorId }
- isAuthenticated: boolean
- token: string

// Actions
- login(credentials)
- logout()
- checkAuth()
```

---

## 👥 Perfis de Usuário

### **1. Instrutor (Instructor)**

**Acesso:** Dashboard Técnico (`/dashboardtech`)

**Funcionalidades:**
- ✅ Gerenciar academias
- ✅ Cadastrar/editar equipamentos
- ✅ Criar/editar exercícios
- ✅ Cadastrar alunos
- ✅ Criar planos de treino
- ✅ Visualizar estatísticas e métricas
- ✅ Acompanhar progresso dos alunos

**Componentes Principais:**
- `DashboardNavBar.vue` - Menu de navegação
- `GymForm.vue` - Formulário de academias
- `EquipmentModal.vue` - Gerenciar equipamentos
- `ExerciseModal.vue` - Gerenciar exercícios
- `WorkoutPlanModalWizard.vue` - Criar planos de treino
- `StudentForm.vue` - Cadastro de alunos

### **2. Aluno (Student)**

**Acesso:** Dashboard do Aluno (`/dashboardstudent`)

**Funcionalidades:**
- ✅ Visualizar planos de treino
- ✅ Iniciar/finalizar sessões de treino
- ✅ Registrar progresso físico (peso, medidas)
- ✅ Visualizar histórico de treinos
- ✅ Acompanhar estatísticas pessoais
- ✅ Perfil e informações pessoais

**Componentes Principais:**
- `StudentNavBar.vue` - Menu do aluno
- `StudentWorkouts.vue` - Visualizar treinos
- `WorkoutSession.vue` - Executar treino
- `StudentProgress.vue` - Registrar progresso
- `StudentHistory.vue` - Histórico de sessões

---

## 🏋️ Módulos Principais

### **1. Gestão de Academias**

**Arquivo:** `components/GymForm.vue`

**Características:**
- Formulário em 2 etapas (wizard)
- Upload de imagem com preview
- Validação de CEP via API ViaCEP
- Gerenciamento de equipamentos
- Controles de quantidade interativos

**Fluxo de Cadastro:**

**Etapa 1 - Informações Básicas:**
```javascript
{
  name: string,           // Nome da academia
  description: string,    // Descrição
  phone: string,          // Telefone (máscara)
  email: string,          // Email
  location: {
    address: string,
    city: string,
    state: string,        // UF (2 letras)
    zipCode: string       // CEP (8 dígitos)
  },
  imageBase64: string     // Imagem em base64
}
```

**Etapa 2 - Equipamentos:**
- Busca de equipamentos existentes
- Adicionar equipamentos personalizados
- Controle de quantidade (incremento/decremento)
- Preview de equipamentos adicionados
- Exibição de imagens dos equipamentos

**Estrutura de Equipamento:**
```javascript
{
  sourceId: string,       // ID do equipamento original
  name: string,
  description: string,
  quantity: number,       // Min: 1, Max: 99
  category: string,       // Ex: 'musculacao', 'cardio'
  muscleGroups: [],       // Array de grupos musculares
  image: string,          // Path da imagem
  isCustom: boolean       // Se é equipamento customizado
}
```

**Validações:**
- ✅ Campos obrigatórios (nome, telefone, endereço)
- ✅ Formato de estado (UF)
- ✅ CEP com 8 dígitos
- ✅ Validação automática via ViaCEP

### **2. Gestão de Equipamentos**

**Arquivo:** `components/EquipmentModal.vue`

**Funcionalidades:**
- Cadastro de novos equipamentos
- Upload de imagem
- Categorização (Musculação, Cardio, Funcional, etc)
- Seleção de grupos musculares
- Níveis de dificuldade
- Instruções de uso e segurança

**Categorias Disponíveis:**
- 🏋️ Musculação
- 🏃 Cardio
- 🤸 Funcional
- 🧘 Alongamento
- ⚖️ Peso Livre
- 🎯 Outros

**Grupos Musculares:**
- Peito, Costas, Ombros, Bíceps, Tríceps
- Antebraço, Abdômen, Pernas, Glúteos, Panturrilha
- Corpo Todo

### **3. Gestão de Exercícios**

**Arquivo:** `components/ExerciseModal.vue`

**Características:**
- Vincular equipamento ao exercício
- Definir grupos musculares trabalhados
- Instruções detalhadas de execução
- Séries, repetições e tempo de descanso
- Dicas de segurança
- Upload de imagem/gif demonstrativo

**Estrutura de Exercício:**
```javascript
{
  name: string,
  description: string,
  equipmentId: ObjectId,
  muscleGroups: [],
  difficulty: enum,       // iniciante, intermediario, avancado
  instructions: string,
  sets: number,
  reps: string,          // Ex: "12-15" ou "10"
  restTime: number,       // Segundos
  image: string,
  safetyTips: string
}
```

### **4. Planos de Treino**

**Arquivo:** `components/WorkoutPlanModalWizard.vue`

**Wizard de 5 Etapas:**

1. **Informações Básicas**
   - Nome do plano
   - Descrição e objetivos
   - Nível de experiência do aluno
   - Data de início/fim

2. **Seleção de Divisão**
   - Divisões pré-definidas (ABC, ABCD, Full Body, Push/Pull/Legs)
   - Criação de divisão customizada
   - Definição de dias da semana

3. **Adicionar Exercícios**
   - Busca de exercícios por categoria/músculo
   - Filtros avançados
   - Adicionar exercícios a cada dia de treino
   - Ordenação por drag-and-drop

4. **Configurar Parâmetros**
   - Séries e repetições por exercício
   - Tempo de descanso
   - Carga (peso)
   - Observações específicas

5. **Revisão e Confirmação**
   - Preview completo do plano
   - Resumo de exercícios por dia
   - Total de séries/volume
   - Confirmação final

**Divisões de Treino:**
```javascript
// ABC - 3 dias
A: Peito, Ombro, Tríceps
B: Costas, Bíceps
C: Pernas, Abdômen

// ABCD - 4 dias
A: Peito, Tríceps
B: Costas, Bíceps
C: Ombros, Abdômen
D: Pernas

// Full Body - Todo o corpo em um dia
// Push/Pull/Legs - Empurrar/Puxar/Pernas
```

### **5. Execução de Treino (Aluno)**

**Arquivo:** `views/WorkoutSession.vue`

**Fluxo de Treino:**

1. **Iniciar Sessão**
   - Selecionar plano de treino ativo
   - Escolher dia da divisão
   - Registrar data/hora de início

2. **Durante o Treino**
   - Lista de exercícios do dia
   - Marcar séries como concluídas
   - Timer de descanso automático
   - Registrar carga utilizada
   - Adicionar observações

3. **Finalizar Sessão**
   - Tempo total de treino
   - Exercícios concluídos vs totais
   - Resumo da sessão
   - Salvamento automático

**Estrutura de Sessão:**
```javascript
{
  studentId: ObjectId,
  workoutPlanId: ObjectId,
  divisionDay: string,
  startTime: Date,
  endTime: Date,
  exercises: [{
    exerciseId: ObjectId,
    sets: [{
      completed: boolean,
      weight: number,
      reps: number,
      notes: string
    }]
  }],
  status: enum,          // em_andamento, concluida, cancelada
  totalDuration: number,  // Minutos
  notes: string
}
```

### **6. Progresso Físico**

**Arquivo:** `views/StudentProgress.vue`

**Métricas Acompanhadas:**

**Medidas Corporais:**
- Peso atual
- Altura
- Percentual de gordura
- IMC (calculado automaticamente)

**Circunferências:**
- Ombro, Peito, Braço, Antebraço
- Cintura, Quadril, Coxa, Panturrilha

**Histórico:**
- Gráficos de evolução de peso
- Comparação de medidas ao longo do tempo
- Fotos de progresso (antes/depois)
- Anotações e observações

---

## 🎨 Sistema de Temas

**Arquivo:** `store/theme.js`

**Temas Disponíveis:**
- 🌞 Light Mode (Claro)
- 🌙 Dark Mode (Escuro)

**Implementação:**
```javascript
// Store Pinia
const themeStore = useThemeStore();

// Toggle de tema
themeStore.toggleTheme();

// Tema atual
const isDarkMode = computed(() => themeStore.isDarkMode);
```

**Persistência:**
- Preferência salva em `localStorage`
- Carregamento automático na inicialização
- Classe dinâmica no body: `.dashboard-light` ou `.dashboard-dark`

**Variáveis CSS:**
```css
/* Light Mode */
.dashboard-light {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
}

/* Dark Mode */
.dashboard-dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border-color: #334155;
  --card-bg: #1e293b;
}
```

---

## 🔔 Sistema de Notificações

**Componente:** `NotificationModal.vue`

**Tipos de Notificação:**
- ✅ **Success** - Verde (operações bem-sucedidas)
- ❌ **Error** - Vermelho (erros e falhas)
- ⚠️ **Warning** - Amarelo (avisos)
- ℹ️ **Info** - Azul (informações gerais)

**Uso:**
```javascript
// Em qualquer componente
const showNotification = (type, title, message) => {
  // type: 'success' | 'error' | 'warning' | 'info'
  // title: string
  // message: string
};

// Exemplos
showNotification('success', 'Salvo!', 'Dados salvos com sucesso.');
showNotification('error', 'Erro', 'Não foi possível salvar.');
showNotification('warning', 'Atenção', 'Preencha todos os campos.');
showNotification('info', 'Informação', 'Processo iniciado.');
```

**Características:**
- Auto-dismiss após 3 segundos
- Animações suaves de entrada/saída
- Ícones contextuais
- Botão de fechar manual
- Responsivo para mobile

---

## 📊 Dashboard e Métricas

### **Dashboard do Instrutor**

**Arquivo:** `views/dashboardtech.vue`

**Cards de Métricas:**

1. **Alunos Ativos**
   - Total de alunos cadastrados
   - Percentual de aumento/diminuição
   - Ícone: 👥

2. **Sessões Concluídas**
   - Total de treinos finalizados
   - Variação percentual
   - Ícone: ✅

3. **Taxa de Conclusão**
   - Percentual de treinos concluídos vs planejados
   - Indicador de adesão
   - Ícone: 📈

4. **Adesão Média**
   - Média de participação dos alunos
   - Comparação com mês anterior
   - Ícone: 💪

5. **Exercícios por Sessão**
   - Média de exercícios realizados
   - Tendência de volume de treino
   - Ícone: 🏋️

6. **Tempo Médio por Sessão**
   - Duração média dos treinos
   - Comparação temporal
   - Ícone: ⏱️

**Gráficos:**
- Evolução de alunos ativos (linha)
- Sessões por dia da semana (barras)
- Distribuição de tipos de treino (pizza)
- Progresso médio dos alunos (área)

### **Dashboard do Aluno**

**Arquivo:** `views/dashboardstudent.vue`

**Widgets:**
- 📅 Próximo treino agendado
- 🔥 Sequência de dias consecutivos
- 📊 Progresso semanal/mensal
- 🎯 Metas e objetivos
- 💪 Último treino realizado
- 📈 Gráfico de evolução de peso

---

## 🛠️ Componentes Reutilizáveis

### **EmptyState.vue**

Componente para estados vazios com ilustração e call-to-action.

```vue
<EmptyState
  icon="dumbbell"
  title="Nenhum equipamento cadastrado"
  message="Comece adicionando seu primeiro equipamento."
  buttonText="Adicionar Equipamento"
  @action="openEquipmentModal"
/>
```

### **ConfirmationModal.vue**

Modal de confirmação para ações destrutivas.

```vue
<ConfirmationModal
  :show="showConfirm"
  title="Excluir Aluno"
  message="Tem certeza que deseja excluir este aluno?"
  confirmText="Excluir"
  cancelText="Cancelar"
  @confirm="handleDelete"
  @cancel="showConfirm = false"
/>
```

### **CategoryFilter.vue**

Filtro por categorias com chips selecionáveis.

```vue
<CategoryFilter
  :categories="['Todos', 'Musculação', 'Cardio', 'Funcional']"
  :selected="selectedCategory"
  @update:selected="selectedCategory = $event"
/>
```

### **ContentSection.vue**

Container padrão para seções de conteúdo com header e ações.

```vue
<ContentSection
  title="Equipamentos"
  subtitle="Gerencie os equipamentos da academia"
  icon="dumbbell"
>
  <template #actions>
    <button @click="openModal">Adicionar</button>
  </template>
  <template #content>
    <!-- Conteúdo aqui -->
  </template>
</ContentSection>
```

---

## 🔌 Integração com API

**Arquivo:** `api.js`

**Configuração Base:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de requisição (adiciona token)
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta (trata erros)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido, redirecionar para login
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Endpoints Principais:**

```javascript
// Autenticação
POST   /auth/login
POST   /auth/register

// Academias
GET    /gyms
GET    /gyms/:id
POST   /gyms
PUT    /gyms/:id
DELETE /gyms/:id

// Equipamentos
GET    /equipments/instructor/:instructorId
GET    /equipments/:id
POST   /equipments
PUT    /equipments/:id
DELETE /equipments/:id

// Exercícios
GET    /exercises/instructor/:instructorId
GET    /exercises/:id
POST   /exercises
PUT    /exercises/:id
DELETE /exercises/:id

// Alunos
GET    /students/instructor/:instructorId
GET    /students/:id
POST   /students
PUT    /students/:id
DELETE /students/:id

// Planos de Treino
GET    /workoutPlans/student/:studentId
GET    /workoutPlans/:id
POST   /workoutPlans
PUT    /workoutPlans/:id
DELETE /workoutPlans/:id

// Sessões de Treino
GET    /workoutSessions/student/:studentId
GET    /workoutSessions/:id
POST   /workoutSessions/start
PUT    /workoutSessions/:id/complete
PUT    /workoutSessions/:id/cancel

// Progresso Físico
GET    /progress/student/:studentId
POST   /progress
PUT    /progress/:id
```

---

## 🎭 Máscaras de Input

**Biblioteca:** vue-the-mask

**Máscaras Utilizadas:**

```javascript
// Telefone
v-mask="['(##) ####-####', '(##) #####-####']"
// Aceita: (11) 1234-5678 ou (11) 91234-5678

// CPF
v-mask="'###.###.###-##'"
// Formato: 123.456.789-00

// CEP
v-mask="'#####-###'"
// Formato: 12345-678

// Data
v-mask="'##/##/####'"
// Formato: 01/01/2024

// Hora
v-mask="'##:##'"
// Formato: 14:30
```

---

## 📱 Responsividade

**Breakpoints:**

```css
/* Mobile First Approach */

/* Smartphones (até 576px) */
@media (max-width: 576px) {
  .grid-3-cols { grid-template-columns: 1fr; }
}

/* Tablets (577px - 768px) */
@media (min-width: 577px) and (max-width: 768px) {
  .grid-3-cols { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop pequeno (769px - 992px) */
@media (min-width: 769px) and (max-width: 992px) {
  .grid-3-cols { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop grande (993px+) */
@media (min-width: 993px) {
  .grid-3-cols { grid-template-columns: repeat(3, 1fr); }
}
```

**Componentes Adaptáveis:**
- Navbar colapsa em menu hambúrguer no mobile
- Cards empilham verticalmente
- Tabelas com scroll horizontal
- Modais ocupam tela inteira no mobile
- Botões flutuantes para ações principais

---

## 🚀 Performance e Otimizações

### **Lazy Loading de Rotas**

```javascript
// router/index.js
const routes = [
  {
    path: '/dashboardtech',
    component: () => import('@/views/dashboardtech.vue'),
    meta: { requiresAuth: true, role: 'instructor' }
  }
];
```

### **Computed Properties**

Uso extensivo de `computed` para evitar re-renderizações desnecessárias:

```javascript
const filteredExercises = computed(() => {
  return exercises.value.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
```

### **Debounce em Pesquisas**

```javascript
let searchTimeout;
const handleSearch = (query) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300);
};
```

### **Imagens Otimizadas**

- Lazy loading de imagens
- Placeholders durante carregamento
- Tratamento de erros de imagem
- Compressão no upload

---

## 🧪 Tratamento de Erros

### **Try-Catch Global**

```javascript
const handleSubmit = async () => {
  try {
    const response = await api.post('/gyms', gymData);
    showNotification('success', 'Sucesso', 'Academia criada!');
  } catch (error) {
    console.error('Erro:', error);
    const message = error.response?.data?.message || 'Erro ao criar academia';
    showNotification('error', 'Erro', message);
  }
};
```

### **Validação de Formulários**

```javascript
const validateForm = () => {
  const errors = [];
  
  if (!formData.value.name?.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  if (formData.value.phone?.replace(/\D/g, '').length < 10) {
    errors.push('Telefone inválido');
  }
  
  if (errors.length > 0) {
    showNotification('warning', 'Validação', errors.join(', '));
    return false;
  }
  
  return true;
};
```

### **Tratamento de Upload**

```javascript
const handleImageUpload = async (file) => {
  // Validação de tipo
  if (!file.type.startsWith('image/')) {
    showNotification('error', 'Erro', 'Apenas imagens são permitidas');
    return;
  }
  
  // Validação de tamanho (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification('error', 'Erro', 'Imagem muito grande (máx 5MB)');
    return;
  }
  
  // Converter para base64
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value.imageBase64 = e.target.result;
  };
  reader.readAsDataURL(file);
};
```

---

## 🔒 Segurança

### **Proteção de Rotas**

```javascript
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.role && user.role !== to.meta.role) {
    next('/unauthorized');
  } else {
    next();
  }
});
```

### **Sanitização de Inputs**

```javascript
const sanitizeInput = (input) => {
  return input.trim()
    .replace(/[<>]/g, '') // Remove tags HTML
    .substring(0, 255);   // Limita tamanho
};
```

### **CORS e Headers**

```javascript
// Configuração no backend
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
```

---

## 📦 Build e Deploy

### **Desenvolvimento**

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run serve

# Build para produção
npm run build

# Lint e correções
npm run lint
```

### **Produção**

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview

# Deploy (exemplo com Vercel)
vercel --prod
```

### **Variáveis de Ambiente**

```env
# .env.development
VUE_APP_API_URL=http://localhost:3000

# .env.production
VUE_APP_API_URL=https://api.seudominio.com
```

---

## 🐛 Debugging

### **Vue DevTools**

Extensão essencial para desenvolvimento:
- Inspeção de componentes
- Visualização de stores Pinia
- Timeline de eventos
- Router atual

### **Console Logs Estratégicos**

```javascript
// Durante desenvolvimento (removidos em produção)
console.log('📊 Dados carregados:', data);
console.error('❌ Erro ao salvar:', error);
console.warn('⚠️ Validação falhou:', validation);
console.table(users); // Visualizar arrays/objetos
```

---

## 📚 Convenções de Código

### **Nomenclatura**

```javascript
// Componentes - PascalCase
GymForm.vue
StudentList.vue

// Variáveis/funções - camelCase
const userName = 'João';
const handleSubmit = () => {};

// Constantes - UPPER_CASE
const API_BASE_URL = 'http://localhost:3000';

// Arquivos de configuração - kebab-case
vue.config.js
router-config.js
```

### **Estrutura de Componente Vue**

```vue
<template>
  <!-- Template HTML -->
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'ComponentName',
  props: {
    // Props aqui
  },
  emits: ['update', 'delete'],
  setup(props, { emit }) {
    // Refs
    const data = ref([]);
    
    // Computed
    const filteredData = computed(() => {});
    
    // Methods
    const handleAction = () => {};
    
    // Lifecycle
    onMounted(() => {});
    
    // Return
    return {
      data,
      filteredData,
      handleAction
    };
  }
};
</script>

<style scoped>
/* Estilos do componente */
</style>
```

---

## 🎓 Boas Práticas Implementadas

### ✅ **Composition API**
- Reutilização de lógica com composables
- Melhor organização do código
- TypeScript-friendly

### ✅ **Single Responsibility**
- Componentes com uma única responsabilidade
- Separação de concerns (UI, lógica, estado)

### ✅ **Props Validation**
```javascript
props: {
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
}
```

### ✅ **Emits Declarados**
```javascript
emits: {
  'update:modelValue': (value) => typeof value === 'string',
  'save': (data) => data !== null
}
```

### ✅ **Scoped Styles**
- Estilos isolados por componente
- Evita conflitos de CSS
- Melhor manutenibilidade

### ✅ **Acessibilidade**
- Labels em inputs
- ARIA attributes
- Navegação por teclado
- Contraste adequado

---

## 📖 Recursos Adicionais

### **Documentações Oficiais**
- [Vue.js 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)

### **Bibliotecas Utilizadas**
- [FontAwesome](https://fontawesome.com/)
- [vue-the-mask](https://github.com/vuejs-tips/vue-the-mask)

---

## 📝 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

---
