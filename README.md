![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-raw/Shoclo-Solutions/nobs-ProfesorEstrella)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/Shoclo-Solutions/nobs-ProfesorEstrella/main)
![GitHub Repo stars](https://img.shields.io/github/stars/Shoclo-Solutions/nobs-ProfesorEstrella)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

# [NoBS] Mi Profesor Estrella

¡No esperes a que te lo digan! Este bot de Discord es el indicado para saber con qué profesor quisieras matricularte. Nada más.

Con este bot, se busca agilizar el proceso de matricula de los alumnos mediante la recomendación de profesores.

## Features

- Actualización contínua del puntaje de los profesores
- Comandos fáciles de ejecutar
- Funcional en servidores, grupo e incluso en conversaciones privadas!
- Posibilidad de añadir comentarios junto con un puntaje

## Feedback

¿No vez a tu profe? ¿Crees que podría ser mejor? ¿Le faltan funciones? ¡Genera un [issue](https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/issues/new) en el repositorio o [ponte en contacto conmigo](mailto:fallaangello@gmail.com)!

## Contribuciones

Debido a la fase temprana del proyecto, las contribuciones, problemas y solicitudes de funciones son bienvenidas.

Cabe recalcar que estos están adheridos al [código de conducta](CODE_OF_CONDUCT.md) del proyecto.

### Requisitos

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [Git](https://git-scm.com/downloads)

### Instalación

1. Clona el repositorio

   ```bash
   git clone https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella.git
   ```

2. Instala las dependencias

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

   ```env
   DISCORD_TOKEN = TuTokenDeDiscord
   DEV_ID1 = TuIDDeDiscord
   DEV_GUILD_ID1 = TuIDDeServidorDeDiscord
   DB_USER = TuUsuarioDeBaseDeDatos
   DB_PASS = TuContraseñaDeBaseDeDatos
   ```

4. Ejecuta el bot

   El bot fue construido mediante [CommandKit](https://commandkit.js.org/), por lo que puedes ejecutarlo en modo de desarrollo con el siguiente comando:

   ```bash
   npx commandkit dev
   ```

   O en modo de producción con:

   ```bash
   npx commandkit build
   npx commandkit start
   ```

## Roadmap

- [ ] Visualización de fotos de los profesores.

- [ ] Posibilidad de sugerir profesores via bot.

- [ ] Implementación del sistema de moderación automática.
