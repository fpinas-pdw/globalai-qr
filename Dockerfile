# Usar una imagen base de Node.js
FROM node:18.18.0 AS build-stage

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN yarn install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación React
RUN yarn build

# Verificar el contenido de la carpeta /app
RUN ls -la /app

# Verificar el contenido de la carpeta /app/dist
RUN ls -la /app/dist

# Usar una imagen base de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]