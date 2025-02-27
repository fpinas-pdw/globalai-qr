# globalai-qr
Aplicación en React, vite y typescript con las siguientes caracteristicas:
- un combo box donde se selecciona una opción que representa una empresa (Prodware, Encamina, NTTData)
- un lector de codigos qr
Al leer el código qr, recoge el valor de este y junto con la empresa seleccionada en el combo box se hace una inserción en una base de datos cosmosDB donde la partition key es el nombre de la empresa.
Los datos de acceso a la base de datos estarán en un archivo .env, así como un array con los nombres de las empresas
