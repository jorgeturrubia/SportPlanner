
import sys

data = """
Técnica Individual	Cambios Dirección	Bote escapatoria	Gesto técnico importante. Cómo se hace: Importante desbloquear la muñeca, para colocar la mano delante del balón, y botar hacia atrás. Pasos cortos y rápidos para poder moverse rápido hacia atrás, con un solo bote. Este bote debo dejarlo libre en la mano, girando el balón en la palma de mano, sin colocar nunca la mano debajo del balón. Cuándo se hace: En situaciones de bloqueo directo cuando me saltan al 2x1 o al show. En situaciones de 2x1 de presión en toda la pista.	https://youtu.be/dZRyT-oHN_g
Técnica Individual	Cambios Dirección	Bote lateral	Para ser capaz de hacer bien el bote lateral es importante dominar varios aspectos: 1. Desbloquear muñeca para poner la mano en una lateral del balón y botar fuerte 2. Disociar bote y pies. Dar el máximo número de apoyos para avanzar. Girar un poco la cadera y cruzar los pies para llegar lo antes posible al punto de destino. No desplazamientos laterales como en defensa. 3. Dejar el bote libre en la palma de la mano para que gire, sin poner la mano debajo del balón.	https://youtu.be/oPVTlJwTBUU
Técnica Individual	Cambios Dirección	Cambio debajo de piernas	(Sin descripción específica)	https://youtu.be/dAyxIYeP_PA
Técnica Individual	Cambios Dirección	Cambio por delante	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Cambios Dirección	Cambio por detrás	(Sin descripción específica)	https://youtu.be/VVIsHHELmsc
Técnica Individual	Cambios Dirección	Cambio por detrás velocidad	Cómo se hace: Para hacer este cambio es importante colocar la mano justo detrás del balón. Muchas veces en iniciación se comete el error de poner la mano debajo y no se le da impulso. Importante colocar mano detrás y adelantar el cuerpo. Cuándo se hace: Recurso interesante en campo abierto, contraataque y transiciones. Para evitar un defensor que pretende robar el balón.	https://youtu.be/aco0FWDXBCE
Técnica Individual	Cambios Dirección	Cambios de dirección	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Cambios Dirección	Doble cambio. Debajo + delante	(Sin descripción específica)	https://youtu.be/2n_uP5teyUA
Técnica Individual	Cambios Dirección	Doble cambio. Debajo / detrás	(Sin descripción específica)	https://youtu.be/rQmSQJH269M
Técnica Individual	Cambios Dirección	Doble cambio. Detras + delante	(Sin descripción específica)	https://youtu.be/yc-biQM9C0Q
Técnica Individual	Cambios Dirección	Doble por detrás	(Sin descripción específica)	https://youtu.be/CpLmBw6dqCU
Técnica Individual	Cambios Dirección	Doble. Under drag / delante	(Sin descripción específica)	https://youtu.be/OmhBJSRWMKo
Técnica Individual	Cambios Dirección	Dobles cambios	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Cambios Dirección	Entre piernas reverse	Cambio por debajo de las piernas de atrás hacia delante, para volver a la misma mano. Cómo se hace: Pequeño momento de pausa, similar a un stop and go. Con el balón atrás, simulando un pase por detrás de la espalda, se cambia por debajo de las piernas, para que el balón vuelva a la misma mano. Cuándo se hace: En mismas situaciones que un stop and go. De esta manera se hace dudar al defensa, para poder atacar de nuevo. En los cambios defensivos en bloqueo directo es muy utilizado.	https://youtu.be/vatQiG8gUJ4
Técnica Individual	Cambios Dirección	Finta de penetración	(Sin descripción específica)	https://youtu.be/NFdUx6ivCOg
Técnica Individual	Cambios Dirección	In & out	(Sin descripción específica)	https://youtu.be/v-g2KdSR3_o
Técnica Individual	Cambios Dirección	Jab cross	Cambio de dirección de dificultad media. Cómo se hace: Cambio por delante, a la misma vez que se finta con el cuerpo hacia la dirección contraria. Lo más complicado del cambio es coordinar que el balón vaya a un lado y el cuerpo al otro. Importante separar el balón del cuerpo y dejar todo el peso sobre la finta. A partir de ahí un fuerte impulso para sobrepasar al defensor. Cuándo se puede aplicar: El defensor tiene que estar a cierta distancia del atacante. Ideal para 1x1 en carrera o en cambios de asignación tras bloqueos directos cuando un hay un mismatch y el interior queda hundido.	https://youtu.be/1_9nqqanix8
Técnica Individual	Cambios Dirección	Latigo	(Sin descripción específica)	https://youtu.be/in8XqNvTbzE
Técnica Individual	Cambios Dirección	Reverso	(Sin descripción específica)	https://youtu.be/M0t_7FnnEtE
Técnica Individual	Cambios Dirección	Scissors step	(Sin descripción específica)	https://youtu.be/PHGXx4MvmaM
Técnica Individual	Cambios Dirección	Shot fake hesitation	Vídeo: Xuancar Navarro	https://youtu.be/sgV4rjRJpOM
Técnica Individual	Cambios Dirección	Shoulder hesitation	Acción similar al stop and go. Cómo se hace: En situaciones de 1x1, girar cadera y pies para orientarnos a línea de banda, con una pequeña parada. Con esto buscamos que el defensor se relaje un segundo. Tras esto, atacar agresivo saliendo con el pie que queda atrás.	https://youtu.be/qKm9FZNuMsQ
Técnica Individual	Cambios Dirección	Skip Step	Acción de juego sobre bote, que consiste en repetir un pie de apoyo, mientas mantenemos el bote vivo en la palma de la mano, sin colocar la mano debajo. Muy habitual para atacar cambios defensivos, obtener momentos de pausa, y tras bloqueo directo. Es una situación sencilla de entrenar, que puede generar ventajas en 1x1, ya que tras el skip step suele existir un cambio de ritmo.	https://youtu.be/7qjDQAFTvPI
Técnica Individual	Cambios Dirección	Stop & go	Acción técnica simple que se puede usar en muchos momentos. Cómo se hace: En situaciones donde se ataca con bote, cambiar el ritmo drásticamente. Parar nuestra velocidad, para que el defensor pare con nosotros, y después volver a arrancar para generar una ventaja. Dejar el bote vivo, simular con el cuerpo que ya no se pretende atacar. Cuándo se hace: Muy común en situaciones de bloqueo directo para atacar al jugador grande. En campo abierto para atacar en 1x1.	https://youtu.be/xEB6XKuM3FI
Técnica Individual	Finalizaciones	Abrazar balón	Finalización sencilla de trabajar y muy útil para anotar en situaciones de actividad defensiva. Cómo se hace: En el inicio del ciclo de pasos, colocar la palma de la mano delante de la pelota. Envolver el balón contra el pecho, protegiendo y evitando que los defensores lo puedan tocar.	https://youtu.be/Yfa-_diETdc
Técnica Individual	Finalizaciones	Bump Finishing	(Sin descripción específica)	https://youtu.be/vILg36gK4_Q
Técnica Individual	Finalizaciones	Doble paso rapido	(Sin descripción específica)	https://youtu.be/4DyVSW3hnWY
Técnica Individual	Finalizaciones	Euro step	Finalización sencilla. Cómo se hace: Cambiar la dirección de los apoyos en la entrada. Importante cambiar de dirección en el segundo apoyo. A veces se cambia mucho en el primero, y el jugador se queda sin fuerza para el segundo. Pequeño momento de pausa después del primer apoyo. El balón puede ir por encima de la cabeza para evitar defensores. Cuándo se hace: Hay varias situaciones: - Meterme entre dos defensores, evitando ayudas defensivas - Contraataque, con la defensa cerca de mí, para que se pase de frenada en el primer apoyo - Atacando una ayuda defensiva - Si lo hago contra un defensor que está en frente de mí, tiene que estar a cierta distancia.	https://youtu.be/Nfp0PGRlfjg
Técnica Individual	Finalizaciones	Fake spin move	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Finalizaciones	Finaliza. alrededor cintura	Cómo se hace: En el primer apoyo de la entrada, se pasa el balón alrededor de la cintura, comenzando de atrás hacia delante desde la mano que bota. Es una finalización sencilla, pero requiere un poco de coordinación. Cuándo se hace: Es útil para evitar robos de balón. Cuando el defensor quiere anticiparse e ir a robar, o para meterse entre dos defensores y proteger el balón de esta manera.	https://youtu.be/Z-0414kODIs
Técnica Individual	Finalizaciones	Finaliza. Aro pasado	(Sin descripción específica)	https://youtu.be/8Frx5HWiekM
Técnica Individual	Finalizaciones	Finalización tras pase	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Finalizaciones	Finalizaciones	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Finalizaciones	Finta de pase	Cómo se hace: Se puede combinar con eurostep, o hacerla de manera independiente. En el primer paso efectuar la finta de pase, y finalizar tras el segundo apoyo. Hay que tener en cuenta varios aspectos: 1. Estirar los brazos al máximo en la finta 2. Mirar hacia donde se finta 3. No hacerlo excesivamente rápido. Cuándo se hace: Buena opción en contraataque y superioridades. Otra opción muy clara, es cuando desbordo en 1x1 y voy hacia canasta contra la ayuda defensiva.	https://youtu.be/4qA1pSBu-_s
Técnica Individual	Finalizaciones	Floater	Cómo se hace: Por la izquierda normalmente se hace con pérdida de paso. Importante bombear mucho el lanzamiento para evitar defensores. Clave el tacto de balón. Por la derecha se suelen hacer dos apoyos rápidos para acabar lanzando con el apoyo de pierna izquierda. Una de las claves es frenar en el último apoyo para que la última batida sea en vertical, no hacia delante. Cuándo se hace: Se suele hacer para evitar el tapón de jugadores más grandes. Debe existir espacio entre atacante y defensor. Importante frenar la carrera para no seguir hacia delante en el salto.	https://youtu.be/yPEa9apF7Lk
Técnica Individual	Finalizaciones	Parada dos tiempos + giro	Finalización para fintar el tiro tras 2 apoyos, girar y terminar con la mano contraria. Cómo se hace: Después de marcar los apoyos normales de una entrada, se finta el tiro, levantándolo por encima de la cabeza, se debe girar sobre el pie de pivote, para finalizar con la mano contraria. Importante estar muy flexionado y hacer una buena finta. Cuándo hacerlo: Muy usual que los jugadores diestros lo hagan cuando entran por lado izquierda. El defensor debe estar cerca del atacante, y lateral a este. Con la finta se busca que el defensor salte o se pase de frenada, y conseguir tirar con facilidad tras el giro.	https://youtu.be/ET3AnY0muKE
Técnica Individual	Finalizaciones	Paradas un tiempo + pivote	(Sin descripción específica)	https://youtu.be/3M51RdkCjHI
Técnica Individual	Finalizaciones	Paso corto paso largo	(Sin descripción específica)	https://youtu.be/t_ydSXi1Xlk
Técnica Individual	Finalizaciones	Perdida paso	Cómo se hace: Entrada con un solo apoyo. Saltar sobre la pierna del lado en que se esté botando y terminar con mano contraria. De esta manera la acción es más natural y sencilla. Lanzando con la misma mano, es una acción más complicada de coordinar, y es recomendable para jugadores más expertos. Cuándo se hace: Muy interesante por línea de fondo. El objetivo suele ser sorprender al defensor para evitar el tapón. Por centro, se suele utilizar para evitar a defensores que vienen del lado de ayuda.	https://youtu.be/3XmMCYGztrs
Técnica Individual	Finalizaciones	Pinoy step	Finalización sencilla en la cual en el primer paso, se realiza una finta de tiro levantando el balón por encima de la cabeza.	https://youtu.be/6rHbBtbsDzY
Técnica Individual	Finalizaciones	Pro hop	Cómo se hace: Coincidir un último bote fuerte con el paso contrario. A partir de ahí pasar el balón por encima de la cabeza, dar un salto fuerte, y caer en un tiempo. Importante no caer sobre el mismo pie de batida ya que serían pasos. Tras caer, salto con ambos pies juntos para finalizar. Cuándo se hace: Recurso técnico para pasar por el espacio entre dos defensores. Importante pasar balón por encima de la cabeza y dar un salto potente que te permita avanzar.	https://youtu.be/AcCbOGr_40I
Técnica Individual	Finalizaciones	Slow step finish	Cómo se hace: El primer paso de la finalización, hacia delante con mucha energía. En el segundo apoyo es importante frenar, y hacer un salto vertical lo más alto que se pueda. Con esto, intentamos que nuestro defensor salte antes que nosotros o se pase de frenada, y poder finalizar con un tiro cercano. En ocasiones se busca el contacto con el defensor y se hace similar a la finalización VEER.	https://youtu.be/XkINUe9s_Uk
Técnica Individual	Finalizaciones	Spin move	Cómo se hace: Entrada en reverso sencilla de efectuar. Para hacerlo bien, es clave hacer coincidir el último bote con el paso contrario. Tras esto, coger el balón con fuerza y girar estando lo más flexionado posible. Se puede dar un apoyo y finalizar o dar dos aprovechando el paso cero. Importante finalizar con la mano contraria para acabar lo más alejado posible de la defensa. Cuándo hacerlo: Para hacer esta entrada el defensor tiene que estar muy cerca del atacante. Lo ideal es hacerlo en carrera cuando el defensor está a un lado del atacante. Una variante a esta finalización es la que hace Tony Parker. En vez de coincidir bote y paso contrario, lo hace tras cambio de dirección por delante.	https://youtu.be/NApZ3_Zqzug
Técnica Individual	Finalizaciones	Step thru	Cómo se hace: Parada en dos tiempos sobre bote. Tras la parada fintar el tiro, para que la defensa salte o pierda su posición defensiva. Tras ello pivotar sobre el primer apoyo, cruzando el pie, para finalizar. Según el reglamento se puede levantar el pie de pivote para pasar o lanzar.	https://youtu.be/UNZthk3tsZw
Técnica Individual	Finalizaciones	Swing step	Cómo se hace: Hacer coincidir un último bote fuerte con el apoyo de la pierna contraria. A partir de ahí, llevar el balón por encima de la cabeza, y cruzar el primer paso para cambiar de dirección. El último apoyo hacerlo con fuerza para finalizar. Se puede hacer pasando el balón por encima de la cabeza o por detrás de la espalda. Cuándo se hace: Se suele utilizar para acabar la entrada por el lado contrario por el que se empieza. Útil en contraataque, con bastante espacio entre atacante y defensor. Muy utilizado por jugadores con gran potencia física para aprovechar bien los apoyos.	https://youtu.be/tpXmOT-K-Xk
Técnica Individual	Finalizaciones	Veer	(Sin descripción específica)	https://youtu.be/sZu7DoMVg1g
Técnica Individual	Manejo de balón	Bote de velocidad	(Sin descripción específica)	https://youtu.be/8PXFc9SbdLM
Técnica Individual	Manejo de balón	Bote mano no dominante	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Manejo de balón	Bote protección	Bote que se realiza para evitar que el defensor pueda robarme el balón. Este bote me permite ver lo que está pasando en la pista, sin riesgo de perder el balón. Cómo se hace: Bote muy bajo, con la mano más alejada del defensor, y colocando mi cuerpo entre balón y defensa. Cuándo se puede hacer: En situaciones de mucha presión del defensor, para ver posibilidades de pase o cambio de dirección. También se suele usar cuando se quiere marcar un sistema, o el jugador con balón está esperando movimientos de sus compañeros. Es importante no abusar de este bote, ya que la defensa quita iniciativa al ataque.	https://youtu.be/Z94GPkvjb6U
Técnica Individual	Manejo de balón	Bote Uso hemisferios	(Sin descripción específica)	https://youtu.be/jVWhtDN6KSo
Técnica Individual	Manejo de balón	Disociar bote y visión	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Manejo de balón	Manejo de balón	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Manejo de balón	Ritmos de bote	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Manejo de balón	Tension bote	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Paradas	Dos tiempos exterior	(Sin descripción específica)	https://youtu.be/iaIDwhAfKO0
Técnica Individual	Paradas	Dos tiempos interior	(Sin descripción específica)	https://youtu.be/Yk8XWQqxRgo
Técnica Individual	Paradas	Parada Un tiempo	(Sin descripción específica)	https://youtu.be/Dz4aBGw0UJY
Técnica Individual	Paradas	Paradas	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Pase	Finta de pase	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Pase	Mano a mano	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Pase	Pase	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Pase	Pase a poste bajo	Si el atacante no tiene contacto con el defensor = pase directo, fuerte y tenso. Si el atacante está en contacto con el defensor = pase picado. Lejos de la posición del defensor. Opciones para pasar al poste bajo: - Fintas de pase o de tiro - Bote lateral para generar una línea de pase libre. - Pivote para ganar espacio. - Combinación de todas estas opciones.	https://youtu.be/b4VrN0hQ-x8
Técnica Individual	Pase	Pase de bolos	Pase poco utilizado. Se utiliza en situaciones de contraataque, normalmente tras bote. Es una opción de pase largo, cuando no se tiene mucha fuerza. Cómo se hace: Poniendo la mano debajo del balón, y utilizando el gesto de lanzamiento de bolos.	https://youtu.be/iryQ0qDOadk
Técnica Individual	Pase	Pase de gancho	(Sin descripción específica)	https://youtu.be/pPG-J-3OqUQ
Técnica Individual	Pase	Pase por detrás espalda	(Sin descripción específica)	https://youtu.be/AwY3iHeSQ7E
Técnica Individual	Pase	Pase tras bote	(Sin descripción específica)	https://youtu.be/b8O6W1NOLrY
Técnica Individual	Pase	Pocket pass	(Sin descripción específica)	https://youtu.be/6hz3uCXGgn8
Técnica Individual	Poste bajo	1 bote + reverso	(Sin descripción específica)	https://youtu.be/xzV4qF8vWFs
Técnica Individual	Poste bajo	Back down	(Sin descripción específica)	https://youtu.be/g0uODB3wzbo
Técnica Individual	Poste bajo	Centro + fondo	(Sin descripción específica)	https://youtu.be/tGC0oXxiUjg
Técnica Individual	Poste bajo	Dos apoyos + extension	(Sin descripción específica)	https://youtu.be/yrL2TZR0bgw
Técnica Individual	Poste bajo	Drop step	(Sin descripción específica)	https://youtu.be/Df8bnmzT4mE
Técnica Individual	Poste bajo	Duck in	Acción de ganar espacio cerca del aro, para recibir y jugar un 1x1. Lo suelen hacer jugadores interiores, pero lo puede jugar cualquier jugador. Consiste en colocarse delante del defensor, flexionado, con un centro de gravedad bajo, y empujar hacia atrás, con el objetivo de recibir cerca de canasta.	https://youtu.be/q2rj_Fy91w0
Técnica Individual	Poste bajo	Fade away	(Sin descripción específica)	https://youtu.be/gU956iTOIFU
Técnica Individual	Poste bajo	Fondo + centro	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Poste bajo	Gancho	(Sin descripción específica)	https://youtu.be/jDS3oB5ROsk
Técnica Individual	Poste bajo	Inverted Up & Under	(Sin descripción específica)	https://youtu.be/NozW-ZLkWKI
Técnica Individual	Poste bajo	Mirotic up & under	Movimiento clásico de Mirotic, con el que consigue generar muchas ventajas. Cómo se hace: Tras recibir en poste bajo, y contactar con el defensor, gira simulando un fade away, para fintar el tiro, y pivotar hacia el aro. Importante subir el balón por encima de la cabeza para que el defensor se crea la finta, y estar muy flexionado. Se repiten dos pivotes sobre el mismo pie, el primero para fintar el tiro, y el segundo para atacar al aro tras la finta.	https://youtu.be/6KaglEDamHY
Técnica Individual	Poste bajo	Nowitzki shot	(Sin descripción específica)	https://youtu.be/z_ISAZ5oF0g
Técnica Individual	Poste bajo	Paradas + pivotes	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Poste bajo	Pivote exterior	Consiste en pivotar para encarar el aro. Normalmente, se pivota sobre el pie que está más cerca del defensor, para separarme de él y generar espacio. Tras esto es posible tirar, leer lo que sucede en la pista o atacar con bote. Cuidado con no hacer pasos. Al pivotar para encarar el aro, ya hemos movido el pie de pivote. No podré cambiarlo y salir sobre la otra pierna.	https://youtu.be/ojsgOPPRIOQ
Técnica Individual	Poste bajo	Poste bajo	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Poste bajo	Quick spin	(Sin descripción específica)	https://youtu.be/xgwTC0PBAz4
Técnica Individual	Poste bajo	Shimmy hook	(Sin descripción específica)	https://youtu.be/OzBEfFQ1jhQ
Técnica Individual	Poste bajo	Shoulder spin	(Sin descripción específica)	https://youtu.be/z46VYVbd31o
Técnica Individual	Poste bajo	Up & under	Gesto técnico en poste bajo. Cómo se hace: Es un gesto sencillo. Consiste en fintar el tiro, para después cruzar el pie y terminar con una finalización. Importante estar flexionado, levantar el balón por encima de la cabeza, y mirar al aro, para que el defensor se crea la finta. Tras esto, cruzar el pie, para terminar.	https://youtu.be/lE7ahKxdUWk
Técnica Individual	Salidas	Abierta mano cambiada	Esta salida es una alternativa sencilla para no cometer pasos en salidas abiertas. Cómo se hace: Lanzar el balón con la mano contraria a la del primer paso de salida. Importante lanzarla fuerte y hacia delante. Una opción para atacar closeout, es colocar las manos como si fueras a tirar, y en ese momento lanzar la pelota hacia delante con la mano de tiro. Cuándo se hace: Para atacar closeout, en situaciones de salidas de bloqueo indirecto, o cualquier situación en las que quiera hacer una salida abierta sin riesgo de hacer pasos.	https://youtu.be/H4w7YmP7YbE
Técnica Individual	Salidas	Finta de salida	Finta de salida o jab step. Es un movimiento simple, que se utiliza para generar pequeñas ventajas en el 1x1. Finta de salida abierta, con un movimiento corto y explosivo para acabar haciendo una salida cruzada.	https://youtu.be/Cl3DnfdbE90
Técnica Individual	Salidas	Finta salida abierta + cambio delante	(Sin descripción específica)	https://youtu.be/MR2O1U4yCII
Técnica Individual	Salidas	Karate kid	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Salidas	Negative step	(Sin descripción específica)	https://youtu.be/qO7xfSPpt14
Técnica Individual	Salidas	Parada 1T + salida cruzada. Causeur	Cómo se hace: Control de balón sobre el pie exterior, y parada en un tiempo posterior. Este pequeño salto que realiza antes de la parada le permite ganar tiempo para leer el juego y ganar explosividad. Tras esto salida cruzada a izquierda o derecha. Gran recurso técnico. Video: Coach Sergio Lopez.	https://youtu.be/1VmKJAkrWnI
Técnica Individual	Salidas	Salida abierta	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Salidas	Salida abierta con bote previo	Salida que consiste en dar un bote bajo y vertical, para poder liberar los pasos, y hacer una salida abierta sin riesgo de cometer pasos de salida. Se suele hacer precedida de una finta de tiro, desbloqueo de muñeca, para hacer un bote muy bajo de adelante hacia atrás, para colocar la mano justo detrás del balón y poder atacar agresivo hacia delante.	https://youtu.be/I8qtq2upI3Q
Técnica Individual	Salidas	Salida cruzada	(Sin descripción específica)	https://youtu.be/mHdMmlyK5CY
Técnica Individual	Salidas	Salida cruzada + cambio por detras	(Sin descripción específica)	https://youtu.be/3VAdZnpUL_I
Técnica Individual	Salidas	Salida en reverso	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Salidas	Salidas	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Tiro	Finta de tiro	(Sin descripción específica)	https://youtu.be/x9w5uQ_H3zM
Técnica Individual	Tiro	Hop	Gesto importante para conseguir fluidez en el tiro. Consiste en una pequeña parada en un tiempo, antes de recibir el balón. Este gesto nos ayuda a transmitir la fuerza de las piernas al lanzamiento y de esta manera hacer un tiro biomecánicamente más eficiente. Esta parada, se utiliza cuando el tirador tiene poco tiempo para armar el lanzamiento. También nos permite salir cruzado hacia ambos lados, lo que es una gran ventaja.	https://youtu.be/F4Wm73EVWSs
Técnica Individual	Tiro	Inverted drag	(Sin descripción específica)	https://youtu.be/Os4Irqju6RI
Técnica Individual	Tiro	Mecanica tiro	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Tiro	Punch drag	Es una acción para generarse espacio y tirar tras bote. Consiste en adelantar el paso del mismo lado del bote. Tras esto rápidamente retroceder ese mismo paso, para generar espacio para tirar. Para tener éxito, hay que coincidir un bote fuerte y agresivo con ese último paso, para que el defensor se vaya un poco para atrás.	https://youtu.be/oq97z_vcGZ8
Técnica Individual	Tiro	Selección de tiro	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Tiro	Side step	(Sin descripción específica)	https://youtu.be/Tf2qmZF9zgs
Técnica Individual	Tiro	Step back	Cómo se hace: Coincidir bote y paso contrario muy agresivo, para que el defensor vaya un poco hacia atrás. Tras esto un pequeño salto hacia atrás o lateral para conseguir espacio suficiente para tirar. Importante que el salto no sea muy grande, para no perder fuerza en las piernas para el siguiente salto. Esta situación es más cómoda para los jugadores cuando la hacen hacia lado NO dominante. En jugadores diestros, es un gesto natural botando hacia izquierda.	https://youtu.be/xxoC4LrVlV0
Técnica Individual	Tiro	Tiro	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Tiro	Tiro libre	(Sin descripción específica)	https://youtu.be/OPTmkIjH0OQ
Técnica Individual	Tiro	Tiro tras bote	(Sin descripción específica)	https://youtu.be/
Técnica Individual	Tiro	Under drag	Gesto técnico para generarse un espacio para tirar tras bote. Cómo se hace: Cambio por debajo de la pierna del lado de bote, yendo de adelante hacia atrás. Importante estar muy flexionado, para que la defensa piense que el atacante sigue la carrera hacia el aro. Tras este cambio, parada en uno o dos tiempos para poder tirar. Cuándo: Para hacer este gesto, el defensor en un inicio debe estar cerca, para caer en la finta del under drag.	https://youtu.be/vUV2fjIXBFU
Técnica Individual	Tiro	Volumen de tiro	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego con balón	1x1	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego con balón	1x1 en carrera	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego con balón	Atacar closeout	(Sin descripción específica)	https://youtu.be/yljitJ1tP8w
Táctica Individual	Juego con balón	Atacar la recepción. Estampida	(Sin descripción específica)	https://youtu.be/RyMeBjwcP7Y
Táctica Individual	Juego con balón	Penetrar y pasar	Acción básica del juego colectivo. Consiste en atacar 1x1 para fijar o atraer defensores, y pasar el balón a un jugador liberado.	https://youtu.be/57vVI-ZUxDY
Táctica Individual	Juego con balón	Si def esta cerca ataco	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego con balón	Si def esta lejos tiro	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego sin balon	Cambio chip defensa/ataque	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego sin balon	Corte a canasta	(Sin descripción específica)	https://youtu.be/xjcFgK4ch84
Táctica Individual	Juego sin balon	Danilovic cut	Corte a canasta que se realiza desde la esquina del lado fuerte del ataque. En situaciones donde el defensor está mirando el balón, el atacante realiza un corte agresivo por delante de su defensa, para adelantarse y conseguir canasta. Corte típico, en situaciones de cuernos o similares.	https://youtu.be/wMB9unuRw4I
Táctica Individual	Juego sin balon	JSB ante 1x1. Exterior	(Sin descripción específica)	https://youtu.be/jSXi23WvkBQ
Táctica Individual	Juego sin balon	JSB ante 1x1. Interior	(Sin descripción específica)	https://youtu.be/HWwa9luUgG0
Táctica Individual	Juego sin balon	JSB para recibir	(Sin descripción específica)	https://youtu.be/Qro2_nQWk-w
Táctica Individual	Juego sin balon	Juego sin balón	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego sin balon	Ocupación espacios	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego sin balon	Pasar y moverse	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego sin balon	Puerta atrás	Jugada ofensiva en la que un jugador en el perímetro se aleja de la canasta, arrastrando al defensor y luego de repente corta a la canasta detrás del defensor para dar un pase. Importante acercarme al pasador para engañar al defensor, y tras esto hacer un cambio de ritmo fuerte en dirección a la canasta.	https://youtu.be/QklsVZIBu6k
Táctica Individual	Juego sin balon	Rebote ofensivo	(Sin descripción específica)	https://youtu.be/
Táctica Individual	Juego sin balon	Respeto espacios	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Atacar cambio defensivo	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Atacar lado no bloqueo	(Sin descripción específica)	https://youtu.be/jIRRUHfrxGA
Táctica Colectiva	Bloqueo directo	Bloqueador	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Bloqueo directo	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Boomerang pass	Acción táctica ante cambio en bloqueo directo. El jugador con balón pasa a un compañero tras el bloqueo directo, para inmediatamente volver a recibir y atacar en 1x1 al cambio defensivo. Es muy común, que tras el cambio, el jugador grande, se relaje tras el pase del atacante. El boomerang pass, nos da la opción de castigar este 1x1. Es interesante que el receptor del pase, se vaya un poco hacia atrás para atacar en carrera al defensor.	https://youtu.be/xnbwnQn4ENk
Táctica Colectiva	Bloqueo directo	Bote atras + giro + pase	(Sin descripción específica)	https://youtu.be/VQuMBKdeqMo
Táctica Colectiva	Bloqueo directo	Fintar bloqueo	Slip o fintar bloqueo. Se trata de una acción muy común en la actualidad. Se trata de fintar un bloqueo directo, para que se active la defensa del bloqueo y atacar 1x1 o el pase a jugador que bloquea. Antes de que llegue a existir el contacto entre bloqueador y defensor, este se aleja rápido para crear una ventaja.	https://youtu.be/uwikTfaNRh0
Táctica Colectiva	Bloqueo directo	Gortat screen	(Sin descripción específica)	https://youtu.be/CfFDgaYbSSM
Táctica Colectiva	Bloqueo directo	In the jail	(Sin descripción específica)	https://youtu.be/XBJ2NLtVmxM
Táctica Colectiva	Bloqueo directo	Meter def en el bloqueo con bote	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Pick and pop	(Sin descripción específica)	https://youtu.be/omGrFbU0ls4
Táctica Colectiva	Bloqueo directo	Pick and roll	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	preuba tag1	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Repick	Situación táctica, que consiste en volver a bloquear a un defensor después de un primer bloqueo. Normalmente se hace cuando el defensor decide pasar por debajo o cuando no hay contacto en el primer bloqueo. El bloqueador debe girar su cuerpo, para poner el 2º bloqueo un poco más cerca del aro. El jugador con balón, debe tener pausa en el bote, dejar pasar al defensor, y cambiar rápidamente de dirección.	https://youtu.be/UhfqL1GDhwk
Táctica Colectiva	Bloqueo directo	Roll corto	(Sin descripción específica)	https://youtu.be/GAIpEDqYdQM
Táctica Colectiva	Bloqueo directo	Snake	(Sin descripción específica)	https://youtu.be/B1fRnRtklwc
Táctica Colectiva	Bloqueo directo	Split	(Sin descripción específica)	https://youtu.be/hE5FU07pPo0
Táctica Colectiva	Bloqueo directo	tag 2	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	tag 3	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo directo	Triangulación	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo indirecto	Abrise si def recorta	(Sin descripción específica)	https://youtu.be/3kfhJX1Zh_Y
Táctica Colectiva	Bloqueo indirecto	Bloqueo Ciego	Video: Juan Carlos Garcia	https://youtu.be/8Zi6FHvF1yM
Táctica Colectiva	Bloqueo indirecto	Bloqueo indirecto	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo indirecto	Continuacion del bloqueador	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo indirecto	Cross screen	Bloqueo que se hace paralelo a línea de fondo. Normalmente de un jugador exterior a un interior, para recibir en poste bajo.	https://youtu.be/7akhpHLWBRU
Táctica Colectiva	Bloqueo indirecto	Flare screen	(Sin descripción específica)	https://youtu.be/T4iyYag8974
Táctica Colectiva	Bloqueo indirecto	Hammer screen	(Sin descripción específica)	https://youtu.be/hWDBFIfFTG0
Táctica Colectiva	Bloqueo indirecto	Juego sin balon. Meter def en bi	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Bloqueo indirecto	Pin down	(Sin descripción específica)	https://youtu.be/wTVBv-Nz_lQ
Táctica Colectiva	Bloqueo indirecto	Ricky screen	Acción en la que un jugador sin balón recibe de manera consecutiva dos bloqueos indirectos en sentido opuesto por parte de un mismo jugador. El jugador que tiene intención de recibir, utiliza un bloqueo indirecto y aprovecha la inercia de su defensor al perseguirle para cambiar de sentido bruscamente	https://youtu.be/zUbajGCPafQ
Táctica Colectiva	Bloqueo indirecto	Rizo	(Sin descripción específica)	https://youtu.be/co7e9Iwi_50
Táctica Colectiva	Bloqueo indirecto	Stagger	(Sin descripción específica)	https://youtu.be/cfDWOPP5wdw
Táctica Colectiva	Bloqueo indirecto	Ucla	(Sin descripción específica)	https://youtu.be/Yo-XLUZTtlQ
Táctica Colectiva	Contrataque	Atacar por centro	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Contrataque	Calles contrataque	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Contrataque	Contrataque	(Sin descripción específica)	https://youtu.be/_lpdZPl5B_8
Táctica Colectiva	Contrataque	CTQ. Atacar por banda	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Contrataque	Pase apertura	(Sin descripción específica)	https://youtu.be/mq50jydCwQ0
Táctica Colectiva	Contrataque	Superioridades	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Contrataque	Touchdown pass	(Sin descripción específica)	https://youtu.be/gxbDyyUShnM
Táctica Colectiva	Contrataque	Trailer	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Contrataque	Transicion	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Juego colectivo	Ataque a zona	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Juego colectivo	Extra pass	(Sin descripción específica)	https://youtu.be/gAaXFvqQQ70
Táctica Colectiva	Juego colectivo	Higw-low	(Sin descripción específica)	https://youtu.be/O_l27IMQ8pc
Táctica Colectiva	Juego colectivo	Inversión de balón	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Juego colectivo	Ocupacion esquina	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Juego colectivo	Pasar y cortar	(Sin descripción específica)	https://youtu.be/eFjAAlEegIU
Táctica Colectiva	Juego colectivo	Remplazar posiciones	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Juego colectivo	Repost	Situación táctica que consiste en volver a jugar un balón interior, después de que el jugador interior saque el balón fuera. Normalmente el defensor interior se suele relajar tras el pase hacia afuera, y es un buen momento para que el atacante gane la posición más cerca del aro, y pueda volver a recibir.	https://youtu.be/-Wj8QcTeUJY
Táctica Colectiva	Juego colectivo	Salida de presión	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Mano a mano	Fintar mano a mano + cambio dirección	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Mano a mano	Mano a mano	(Sin descripción específica)	https://youtu.be/
Táctica Colectiva	Mano a mano	Mano a mano + atacar	(Sin descripción específica)	https://youtu.be/lpd_sfRcivg
Táctica Colectiva	Mano a mano	Puerta atrás mano a mano	(Sin descripción específica)	https://youtu.be/kcgcsvySCZ8
Táctica Colectiva	Mano a mano	Romper mano a mano con bote	(Sin descripción específica)	https://youtu.be/6YE_NusAtlw
Táctica Colectiva	Mano a mano	Tiro tras mano a mano	(Sin descripción específica)	https://youtu.be/yZxWEhWDBoo
Estrategia	Conceptos de juego	(Sin conceptos específicos)	(Sin descripción específica)	https://youtu.be/
Estrategia	Fondos/Bandas	(Sin conceptos específicos)	(Sin descripción específica)	https://youtu.be/
Estrategia	Set VS Individual	(Sin conceptos específicos)	(Sin descripción específica)	https://youtu.be/
Estrategia	Set VS Zona	(Sin conceptos específicos)	(Sin descripción específica)	https://youtu.be/
Estrategia	Situaciones especiales ataque	ATO. Saras FCB. Iverson, UCLA, postup	(Sin descripción específica)	https://youtu.be/
Estrategia	Transición ofensiva	(Sin conceptos específicos)	(Sin descripción específica)	https://youtu.be/
"""

with open("seed_concepts.sql", "w", encoding="utf-8") as f:
    f.write("DO $$\n")
    f.write("DECLARE\n")
    f.write("    v_cat_id INT;\n")
    f.write("BEGIN\n")

    seen = set()

    for line in data.strip().split('\n'):
        parts = line.split('\t')
        if len(parts) < 5:
            continue
        
        category = parts[0].strip()
        subcategory = parts[1].strip()
        concept = parts[2].strip()
        description = parts[3].strip()
        url = parts[4].strip()

        if concept == "(Sin conceptos específicos)":
            continue

        # Deduplicate
        key = (subcategory, concept)
        if key in seen:
            continue
        seen.add(key)

        # Clean data
        if description == "(Sin descripción específica)":
            description = "NULL"
        else:
            description = f"'{description.replace("'", "''")}'"
        
        if url == "https://youtu.be/" or not url:
            url = "NULL"
        else:
            url = f"'{url.replace("'", "''")}'"

        concept_safe = concept.replace("'", "''")
        subcategory_safe = subcategory.replace("'", "''")

        f.write(f"    -- {concept}\n")
        f.write(f"    SELECT \"Id\" INTO v_cat_id FROM \"ConceptCategories\" WHERE \"Name\" = '{subcategory_safe}' LIMIT 1;\n")
        f.write(f"    IF v_cat_id IS NOT NULL THEN\n")
        f.write(f"        INSERT INTO \"SportConcepts\" (\"Name\", \"Description\", \"Url\", \"ConceptCategoryId\", \"IsActive\")\n")
        f.write(f"        SELECT '{concept_safe}', {description}, {url}, v_cat_id, true\n")
        f.write(f"        WHERE NOT EXISTS (SELECT 1 FROM \"SportConcepts\" WHERE \"Name\" = '{concept_safe}' AND \"ConceptCategoryId\" = v_cat_id);\n")
        f.write(f"    END IF;\n")

    f.write("END $$;\n")
