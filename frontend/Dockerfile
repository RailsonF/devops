FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Roda o Vite forçando ele a expor a rede para fora do contêiner
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]