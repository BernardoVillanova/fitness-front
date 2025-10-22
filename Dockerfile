FROM node:18-alpine AS build

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código e fazer build
COPY . .
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar build para nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração básica do nginx
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]