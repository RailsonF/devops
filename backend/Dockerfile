# Usa uma versão leve do Node
FROM node:20-alpine

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta padrão do Wrangler
EXPOSE 8787

# Roda o comando de dev garantindo que o Wrangler escute conexões externas
CMD ["npm", "run", "dev", "--", "--ip", "0.0.0.0"]