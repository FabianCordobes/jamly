# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código al contenedor
COPY . .

# Expone el puerto 3001 para que la API esté accesible
EXPOSE 3001

# Comando para ejecutar NestJS
CMD ["npm", "run", "start:dev"]
