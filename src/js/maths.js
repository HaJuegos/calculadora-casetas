/**
 * Funcion auxiliar que calcula la posicion de un numero.
 * @param {number} v Valor a tomar en cuenta.
 * @returns {number} Devuelve el nuevo calculo de la posicion.
 * @author HaJuegos - 20-11-2026
 */
const pos = (v) => (Number.isFinite(v) && v > 0 ? v : 0);

/**
 * @typedef {Object} AreaInput
 * @property {number} a
 * @property {number} l
 * @property {number} h
 * @property {number} t
 * @property {number} doorW
 * @property {number} doorH
 * @property {number} windowW
 * @property {number} windowH
 * @property {number} wastePercent
 */

/**
 * @typedef {Object} CostInput
 * @property {number} priceM2
 * @property {number} structure
 * @property {number} doorWindow
 * @property {number} painting
 * @property {number} supplies
 * @property {number} workers
 * @property {number} days
 * @property {number} dailyWage
 * @property {number} rental
 * @property {number} services
 * @property {number} maintenance
 * @property {number} management
 * @property {number} salePrice
 */

/**
 * @typedef {Object} ProductionRow
 * @property {number} x
 * @property {number} cost
 * @property {number} income
 * @property {number} profit
 */

/**
 * @typedef {Object} AreaResult
 * @property {number} s
 * @property {number} walls
 * @property {number} floor
 * @property {number} skirts
 * @property {number} pediments
 * @property {number} door
 * @property {number} window
 * @property {number} total
 * @property {number} sheet
 */

/**
 * @typedef {Object} CostSummary
 * @property {AreaResult} area
 * @property {ModelCosts} costs
 * @property {number} utility
 * @property {number} priceM2
 */

/**
 * @typedef {Object} ImproveResult
 * @property {CostSummary} current
 * @property {CostSummary} proposed
 * @property {number} savings
 * @property {number | null} profitIncrease
 */

/**
 * Clase auxiliar que maneja los eventos relacionados a la calculadora de las Casetas.
 * @class CalculadoraCaseta
 * @author HaJuegos - 20-11-2026
 */
export class CalculatorCaseta {
    /**
     * Eventos principales de la clase que calcula los parametros de la calculadora para la fabricacion de las casetas prefabricadas.
     * @param {AreaInput} d Datos a considerar.
     * @author HaJuegos - 20-11-2026
     * @constructor
     */
    constructor(d) {
        this.a = pos(d.a);
        this.l = pos(d.l);
        this.h = pos(d.h);
        this.t = pos(d.t);
        this.door = pos(d.doorW) * pos(d.doorH);
        this.window = pos(d.windowW) * pos(d.windowH);
        this.wastePercent = pos(d.wastePercent);
    }

    /**
     * Metodo principal que calcula el area.
     * @returns {AreaResult} Devuelve los valores calculados.
     * @author HaJuegos - 20-11-2026
     */
    calculateArea() {
        const s = Math.sqrt((this.a / 2) ** 2 + this.t ** 2);
        const walls = 2 * this.h * (this.a + this.l);
        const floor = this.a * this.l;
        const skirts = 2 * this.l * s;
        const pediments = this.a * this.t;
        const total = Math.max(0, walls + floor + skirts + pediments - this.door - this.window);
        const sheet = total * (1 + this.wastePercent / 100);

        return { s, walls, floor, skirts, pediments, door: this.door, window: this.window, total, sheet };
    }
}

/**
 * Clase auxiliar que maneja los eventos relacionados a los costos de un modelo de casetas.
 * @class ModeloCostos
 * @author HaJuegos - 20-11-2026
 */
export class ModelCosts {
    /**
     * Eventos iniciales de la clase cuando es llamada o inicializada.
     * @param {number} areaLamina Valor del area de la lamina a considerar.
     * @param {CostInput} d Valores de datos a considerar.
     * @author HaJuegos - 20-11-2026
     * @constructor
     */
    constructor(areaLamina, d) {
        this.costLamina = Math.round(pos(areaLamina) * pos(d.priceM2));
        this.manualLabor = pos(d.workers) * pos(d.days) * pos(d.dailyWage);
        this.c = this.costLamina + pos(d.structure) + pos(d.doorWindow) + pos(d.painting) + pos(d.supplies) + this.manualLabor;
        this.F = pos(d.rental) + pos(d.services) + pos(d.maintenance) + pos(d.management);
        this.p = pos(d.salePrice);
        this.margin = this.p - this.c;
        this.exactBalance = this.margin > 0 ? this.F / this.margin : null;
        this.balance = this.exactBalance === null ? null : Math.ceil(this.exactBalance);
    }

    /**
     * Metodo auxiliar que calcula el costo total.
     * @param {number} x Valor a considerar.
     * @returns {number} Costo total calculado.
     * @author HaJuegos - 20-11-2026
     */
    totalCost(x) {
        return this.F + this.c * x;
    }

    /**
     * Metodo auxiliar que calcula el costo obtenido de las unidades vendidas.
     * @param {number} x Valores a considerar.
     * @returns {number} Valores vendidas calculados.
     * @author HaJuegos - 20-11-2026
     */
    income(x) {
        return this.p * x;
    }

    /**
     * Metodo auxiliar que calcula las unidades en total.
     * @param {number} x Valores a considerar.
     * @returns {number} Devuelve las unidades totales.
     * @author HaJuegos - 20-11-2026
     */
    utility(x) {
        return this.income(x) - this.totalCost(x);
    }

    /**
     * Metodo auxiliar que calcula las cantidades de produccion final a evaluar.
     * @param {number[]} amounts Cantidades a evaluar.
     * @returns {ProductionRow[]} Devuelve las filas de produccion.
     * @author HaJuegos - 20-11-2026
     */
    productionTable(amounts) {
        return amounts.map((x) => ({
            x,
            cost: this.totalCost(x),
            income: this.income(x),
            profit: this.utility(x),
        }));
    }
}

/**
 * Funcion auxiliar que compara los escenarios actuales contra la propuesta de mejora de las casetas.
 * @param {AreaInput} dataArea Dimensiones base del area.
 * @param {CostInput} dataCosts Costos base a considerar.
 * @param {{ wasteNew: number, discount: number }} param0 Nuevo desperdicio y descuento a evaluar.
 * @param {number} x Resumen comparativo a evaluar.
 * @returns {ImproveResult} Devuelve los datos finales calculados.
 * @author HaJuegos - 20-11-2026
 */
export function calculateImprove(dataArea, dataCosts, { wasteNew, discount }, x) {
    const casetaAct = new CalculatorCaseta(dataArea);
    const areaAct = casetaAct.calculateArea();
    const costosAct = new ModelCosts(areaAct.sheet, dataCosts);

    const casetaProp = new CalculatorCaseta({ ...dataArea, wastePercent: wasteNew });
    const areaProp = casetaProp.calculateArea();
    const precioProp = pos(dataCosts.priceM2) * (1 - Math.min(pos(discount), 100) / 100);
    const costosProp = new ModelCosts(areaProp.sheet, { ...dataCosts, priceM2: precioProp });

    const utilAct = costosAct.utility(x);
    const utilProp = costosProp.utility(x);
    const costoTotalAct = costosAct.totalCost(x);
    const costoTotalProp = costosProp.totalCost(x);

    return {
        current: { area: areaAct, costs: costosAct, utility: utilAct, priceM2: pos(dataCosts.priceM2) },
        proposed: { area: areaProp, costs: costosProp, utility: utilProp, priceM2: precioProp },
        savings: costoTotalAct - costoTotalProp,
        profitIncrease: utilAct > 0 ? (utilProp - utilAct) / utilAct : null,
    };
}
