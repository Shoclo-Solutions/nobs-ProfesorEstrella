# Contribuir a [NoBS] Mi Profe Estrella

¡Gracias por su interés en contribuir a [NoBS] Mi Profe Estrella! Nos entusiasma ver lo que puedes hacer aquí.

Animamos y valoramos todo tipo de contribuciones. Consulta la [Tabla de contenidos](#table-of-contents) para conocer las distintas formas de ayudar y los detalles sobre cómo se gestionan en este proyecto. Asegúrese de leer la sección correspondiente antes de realizar su contribución. Nos facilitará mucho las cosas a los encargados del mantenimiento y facilitará la experiencia a todos los implicados.

> ¿No tienes tiempo para contribuir? Aún puede ayudarnos. Aquí tienes algunas formas de ayudarnos:
>
> - Hazte fan del proyecto
> - Haz referencia a este proyecto en el léame de tu proyecto

## Table of Contents

- [Tengo una pregunta](#tengo-una-pregunta)
- [Quiero contribuir](#quiero-contribuir)
  - [Reportar bugs](#reportar-bugs)
  - [Sugerir mejoras](#sugerir-mejoras)
  - [Tu primera contribución](#tu-primera-contribución)
  - [Mejorando la documentación](#mejorando-la-documentación)

## Tengo una pregunta

Antes de plantear una pregunta, lo mejor es buscar [issues] existentes (https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/issues) que puedan ayudarle. En caso de que haya encontrado un issue adecuado y siga necesitando aclaraciones, puede escribir su pregunta en esa issue. También es aconsejable buscar primero respuestas en Internet.

Si después sigues sintiendo la necesidad de hacer una pregunta y necesitas aclaraciones, te recomendamos lo siguiente:

- Abra una [incidencia](https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/issues/new/choose).
- Elige la plantilla en blanco.
- Proporciona todo el contexto que puedas sobre con qué te estás encontrando.
- Proporciona las versiones del proyecto y de la plataforma (nodejs, npm, etc), dependiendo de lo que parezca relevante.
- Selecciona la etiqueta `question`.

Nos ocuparemos del problema lo antes posible.

Traducción realizada con la versión gratuita del traductor DeepL.com

## Quiero contribuir

### Reportar bugs

#### Antes de reportar un bug

Un buen informe de error no debería obligar a otros a buscarle para obtener más información. Por lo tanto, le pedimos que investigue detenidamente, recopile información y describa el problema con detalle en su informe. Por favor, complete los siguientes pasos por adelantado para ayudarnos a solucionar cualquier posible error lo más rápido posible.

- Asegúrese de que utiliza la última versión.
- Determine si su fallo es realmente un fallo y no un error por su parte, por ejemplo, el uso de componentes/versiones de entorno incompatibles (Si está buscando ayuda, puede que desee consultar [esta sección].(#tengo-una-pregunta)).
- Para ver si otros usuarios han experimentado (y potencialmente ya resuelto) el mismo problema que usted tiene, compruebe si no existe ya un informe de fallo para su fallo o error en el [bug tracker](https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/labels/bug).
- Asegúrate también de buscar en Internet (incluido Stack Overflow) para ver si usuarios ajenos a la comunidad de GitHub han comentado el problema.
- Recopila información sobre el error:
  - Rastreo de pila (Traceback)
  - Sistema operativo, plataforma y versión (Windows, Linux, macOS)
  - Versión del intérprete, gestor de paquetes, dependiendo de lo que parezca relevante.
  - Posiblemente su entrada y la salida
  - ¿Puedes reproducir el problema de forma fiable? ¿Puedes reproducirlo también con versiones anteriores?

#### ¿Cómo envío un buen informe de error?

> Nunca debe informar de problemas relacionados con la seguridad, vulnerabilidades o errores que incluyan información sensible en el rastreador de problemas, o en cualquier otro lugar en público. Los errores sensibles deben enviarse por correo electrónico a <fallaangello@gmail.com>.

Usamos GitHub issues para rastrear fallos y errores. Si te encuentras con un problema con el proyecto:

- Abre un [issue](https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/issues/new/choose). (Como en este momento no podemos estar seguros de si se trata de un error o no, te pedimos que no hables de error todavía y que no etiquetes la incidencia).
- Elige la plantilla de informe de fallo.
- Explique el comportamiento que esperaría y el comportamiento real.
- Proporcione tanto contexto como sea posible y describa los _pasos de reproducción_ que otra persona puede seguir para recrear el problema por su cuenta. Esto suele incluir su código. Para los buenos informes de errores, debe aislar el problema y crear un caso de prueba reducido.
- Proporciona la información que has recopilado en la sección anterior.

Una vez archivado:

- El equipo del proyecto etiquetará la incidencia como corresponda.
- Un miembro del equipo intentará reproducir el problema con los pasos que has proporcionado. Si no hay pasos de reproducción o no hay una manera obvia de reproducir el problema, el equipo le pedirá esos pasos y marcará el problema como `needs-repro`. Los errores con la etiqueta `needs-repro` no se tratarán hasta que se reproduzcan.
- Si el equipo es capaz de reproducir el problema, se marcará como `needs-fix`, así como posiblemente otras etiquetas (como `critical`), y el problema se dejará para ser [implementado por alguien](#).

<!-- You might want to create an issue template for bugs and errors that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Sugerir mejoras

Esta sección le guiará a la hora de enviar una sugerencia de mejora para [NoBS] Mi Profe Estrella, **incluyendo características completamente nuevas y pequeñas mejoras de la funcionalidad existente**. Seguir estas directrices ayudará a los mantenedores y a la comunidad a entender su sugerencia y a encontrar sugerencias relacionadas.

#### Antes de enviar una mejora

- Asegúrese de que está utilizando la última versión.
- Realice una [búsqueda](https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/issues) para ver si la mejora ya ha sido sugerida. Si es así, añada un comentario a la incidencia existente en lugar de abrir una nueva.
- Averigua si tu idea encaja con el alcance y los objetivos del proyecto. En tus manos está argumentar con fuerza para convencer a los desarrolladores del proyecto de las ventajas de esta función. Ten en cuenta que queremos funciones que sean útiles para la mayoría de nuestros usuarios y no sólo para un pequeño subgrupo.

#### ¿Cómo envío una buena sugerencia de mejora?

Las sugerencias de mejora se registran como [GitHub issues](https://github.com/Shoclo-Solutions/nobs-ProfesorEstrella/issues).

- Comienza abriendo una incidencia con la plantilla `Feature request`.
- Utiliza un **título claro y descriptivo** para identificar la sugerencia.
- Proporcione una **descripción paso a paso de la mejora sugerida** lo más detallada posible.
- Describa el comportamiento actual y explique qué comportamiento espera ver en su lugar y por qué. En este punto también puede decir qué alternativas no le funcionan.
- Puedes **incluir capturas de pantalla y GIF animados** que te ayuden a demostrar los pasos o señalar la parte con la que está relacionada la sugerencia. Puedes utilizar [esta herramienta](https://www.cockos.com/licecap/) para grabar GIFs en macOS y Windows.
- **Explica por qué esta mejora sería útil** para la mayoría de los usuarios de [NoBS] Mi Profe Estrella. También puedes señalar otros proyectos que lo resolvieron mejor y que podrían servir de inspiración.

### Tu Primera Contribución de Código

Todas las instrucciones para contribuir con código a [NoBS] Mi Profe Estrella, incluyendo las instrucciones de configuración, están disponibles en el [README](./README.md). Si estás buscando un lugar por donde empezar, puedes mirar los temas etiquetados con `good first issue`.

### Mejorar La Documentación

<!-- TODO
Actualizar, mejorar y corregir la documentación
-->

¿Has encontrado una errata en la documentación? ¿Crees que algo no está claro? ¿Quieres añadir una sección? Perfecto. Apreciamos tu esfuerzo por mejorar la documentación.

- Clona la rama `documentation`.
- Asegúrate de tener la última versión de la rama.
- Haz tus cambios.
  > Parte de la documentación se almacena en la carpeta `docs`. Puedes editar los archivos markdown directamente en GitHub o clonar el repositorio y editarlos localmente.
- Confirma tus cambios.
- Empuja tus cambios a tu fork.
- Abre un pull request a la rama `documentation` del repositorio principal.

## Atribución

Esta guía está basada en el **contributing-gen**. [¡Haz la tuya!](https://github.com/bttger/contributing-gen)!
