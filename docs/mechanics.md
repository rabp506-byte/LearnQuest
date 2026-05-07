# Gamification Mechanics: Classcraft System

## 1. Atributos Principales (Stats)

| Atributo | Nombre Completo | Función |
| :--- | :--- | :--- |
| **XP** | Experience Points | Determinan el progreso de nivel y la adquisición de nuevos poderes. |
| **HP** | Health Points | Representan la "vida" académica/conductual. Si llegan a 0, el usuario cae en batalla. |
| **AP** | Action Points | Energía necesaria para activar poderes especiales. Se regenera diariamente. |
| **PP** | Power Points | Puntos utilizados para comprar o mejorar habilidades en el árbol de talentos. |

---

## 2. Balance de Clases

### A. Guerrero (The Guardian)
*   **HP Máximo:** 80 - 100
*   **AP Máximo:** 30 - 50
*   **Rol:** Protector. Absorbe daño dirigido a aliados vulnerables.
*   **Poder Inicial:** *Protección* (Gasta AP para recibir el daño en lugar de un aliado).

### B. Mago (The Mage)
*   **HP Máximo:** 30 - 50
*   **AP Máximo:** 80 - 100
*   **Rol:** Batería. Provee y transfiere energía (AP) al resto del equipo.
*   **Poder Inicial:** *Transferencia de Maná* (Gasta sus AP para recargar los AP de un aliado).

### C. Curandero (The Healer)
*   **HP Máximo:** 50 - 70
*   **AP Máximo:** 50 - 70
*   **Rol:** Soporte vital. Restaura HP a aliados que han cometido faltas.
*   **Poder Inicial:** *Curación* (Gasta AP para restaurar HP de un aliado).

---

## 3. Sistema de Sentencias (HP = 0)

Cuando un jugador llega a 0 HP, "Cae en Batalla" y debe cumplir una sentencia aleatoria para revivir.

| Dado (1-20) | Sentencia | Efecto en el Juego |
| :--- | :--- | :--- |
| 1-5 | **El Castigo del Escriba** | Entregar un resumen extra o documentación adicional. |
| 6-10 | **Debilidad Temporal** | El jugador revive con solo 1 HP y 0 AP. |
| 11-15 | **Drenaje de Grupo** | Todo el equipo pierde 10 HP por el fallo del compañero. |
| 16-19 | **Servicio Comunitario** | Ayudar a un compañero con una duda técnica (Peer Review). |
| 20 | **Indulto Real** | El jugador revive con 50% de HP sin penalización. |

---

## 4. Lógica de Eventos Aleatorios (Daily Events)

Al inicio de cada sesión, el sistema genera un evento global mediante la siguiente lógica:

*   **Nombre:** Identificador temático.
*   **Target:** A quién afecta (Global, Clase específica, o Jugador con menor/mayor nivel).
*   **Efecto:** Modificador de Stats o Regla especial por 24 horas.

**Ejemplos de implementación:**
*   *Invasión:* Todos pierden 5 HP a menos que un Guerrero use un poder de defensa.
*   *Bendición:* Los Curanderos ganan el doble de XP hoy.
*   *Sequía:* El AP no se regenera automáticamente hoy.

---

## 5. Fórmulas de Progresión

Lógica para el cálculo de nivel (Progreso no lineal):

$$XP_{NextLevel} = CurrentLevel^{2} \times 100 + 500$$
