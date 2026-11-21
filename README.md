# Calculadora de Caseta Prefabricada

Programa en Node.js que calcula el área de lámina, los costos de producción, el punto de equilibrio y el impacto de una propuesta de mejora para la fabricación de casetas de seguridad prefabricadas con techo a dos aguas.

## Problema

Una empresa metalmecánica fabrica casetas de vigilancia en lámina galvanizada. Presenta dos inconvenientes:

1. Desperdicio de lámina por calcular el área de forma empírica.
2. Dificultad para estimar el costo total según la cantidad de casetas producidas.

## Modelo matemático

**Área total** (prisma rectangular + prisma triangular):

```
s = √((a/2)² + t²)
A_total = 2h(a + l) + a·l + 2·l·s + a·t − A_puerta − A_ventana
A_lámina = A_total · (1 + desperdicio)
```

**Costos:**

```
C(x) = F + c·x        (costo total)
I(x) = p·x            (ingreso)
U(x) = I(x) − C(x)    (utilidad)
x_equilibrio = F / (p − c)
```

| Variable   | Descripción                                            |
| ---------- | ------------------------------------------------------ |
| a, l, h, t | Ancho, largo, altura de paredes y altura del techo (m) |
| F          | Costos fijos mensuales (COP)                           |
| c          | Costo variable por caseta (COP)                        |
| p          | Precio de venta por caseta (COP)                       |
| x          | Casetas producidas al mes                              |

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- Git

## Instalación

```bash
git clone https://github.com/HaJuegos/calculadora-casetas.git
cd calculadora-casetas
npm install
```

## Uso

```bash
npm start
```

Para ejecutar las pruebas:

```bash
npm test
```

## Resultados de referencia

| Indicador                           | Proceso actual | Proceso mejorado |
| ----------------------------------- | -------------- | ---------------- |
| Área total (m²)                     | 20,70          | 20,70            |
| Área de lámina con desperdicio (m²) | 22,77          | 21,735           |
| Costo variable por caseta (COP)     | 2.492.490      | 2.389.859        |
| Punto de equilibrio (casetas/mes)   | 3              | 2                |
| Utilidad con 8 casetas (COP)        | 8.860.080      | 9.681.128        |

## Personalización

Todos los datos (dimensiones, costos, precio y capacidad) se modifican en `src/config/datos.js`. Los valores incluidos son de referencia y deben actualizarse con cotizaciones reales.
