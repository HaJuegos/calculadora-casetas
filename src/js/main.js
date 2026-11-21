import { calculateImprove } from "./maths.js";

import "bootstrap";

/**
 * Funcion auxiliar que calcula los valores en pesos colombianos.
 * @param {number} d Decimal minimo y maximos a considerar.
 * @returns {Intl.NumberFormat} Devuelve el nuevo formato de numero a considerar.
 * @author HaJuegos - 20-11-2026
 */
const nf = (d) => new Intl.NumberFormat("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });

/**
 * Funcion auxiliar que formatea un numero con signo menos tipografico.
 * @param {number} n Valor numerico a considerar.
 * @param {number} [d] (Opcional, siempre es 0) Cantidad de decimales a considerar.
 * @returns {string} Devuelve el signo tipografico.
 * @author HaJuegos - 20-11-2026
 */
const fmt = (n, d = 0) => nf(d).format(n).replace("-", "−");

/**
 * Funcion auxiliar qeu formatea un monto en pesos colombianos.
 * @param {number} n Valor monetario a considerar.
 * @returns {string} Formateo en concreto.
 * @author HaJuegos - 20-11-2026
 */
const cop = (n) => (n < 0 ? "−$" : "$") + nf(0).format(Math.abs(n));

/**
 * Funcion auxiliar que pluraliza la palabra casera segun la cantidad.
 * @param {number} n Cantidad a considerar.
 * @returns {string} Variantes en concreto.
 * @author HaJuegos - 20-11-2026
 */
const casetas = (n) => `${n} ${n === 1 ? "caseta" : "casetas"}`;

/**
 * Funcion auxiliar que obtiene un elemento del DOM por su ID.
 * @param {string} id Identificador del elemento
 * @returns {HTMLElement | null} Devuelve el elemento obtenido.
 * @author HaJuegos - 20-11-2026
 */
const $ = (id) => document.getElementById(id);

/**
 * Funcion auxiliar que asigna texto a un elemento del DOM si existe.
 * @param {string} id ID del elemento.
 * @param {string} texto Texto a mostrar.
 * @author HaJuegos - 20-11-2026
 */
const set = (id, texto) => {
    const el = $(id);

    if (!el) {
        throw new Error(`Missing output element #${id}`);
    }

    el.textContent = texto;
};

/**
 * Funcion auxiliar que lee un numero no negativo desde un input y lo acota a un maximo.
 * @param {string} id ID del input
 * @param {number} [max] Valor maximo permitido.
 * @returns {number} Numero a convertir.
 * @author HaJuegos - 20-11-2026
 */
const readPos = (id, max = Infinity) => {
    const el = $(id);

    if (!(el instanceof HTMLInputElement)) {
        throw new Error(`Missing numeric input #${id}`);
    }

    const v = parseFloat(el.value);
    return Number.isFinite(v) ? Math.min(Math.max(v, 0), max) : 0;
};

const productionsBase = [1, 2, 3, 4, 6, 8];

/**
 * Clase principal que controla los eventos de la pagina estatica y los calculos matematicos de las casetas prefabricadas de las laminas.
 * @class ViewCaseta
 * @author HaJuegos - 20-11-2026
 */
class ViewCaseta {
    /**
     * Eventos iniciales de la clase cuando es llamada o inicializada.
     * @author HaJuegos - 20-11-2026
     * @constructor
     */
    constructor() {
        this.keyTheme = "caseta-lamina-tema";
        this.btnTheme = document.querySelector("#btn-tema");

        if (!(this.btnTheme instanceof HTMLButtonElement)) {
            throw new Error("Missing theme button #btn-tema");
        }

        this.root = document.documentElement;
        this.sysTheme = window.matchMedia("(prefers-color-scheme: dark)");
    }

    /**
     * Metodo principal general que inicializa los eventos principales de la pagina.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    init() {
        document.addEventListener("input", (e) => {
            if (e.target instanceof HTMLInputElement && e.target.type === "number") {
                this.mainRender();
            }
        });

        const printButton = $("btn-imprimir");

        if (!printButton) {
            throw new Error("Missing print button #btn-imprimir");
        }

        printButton.addEventListener("click", () => window.print());

        this.#initTheme();
        this.mainRender();
    }

    /**
     * Metodo principal que inicializa los renders iniciales de la pagina.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    mainRender() {
        const areasData = {
            a: readPos("in-a"),
            l: readPos("in-l"),
            h: readPos("in-h"),
            t: readPos("in-t"),
            doorW: readPos("in-pw"),
            doorH: readPos("in-ph"),
            windowW: readPos("in-vw"),
            windowH: readPos("in-vh"),
            wastePercent: readPos("in-desp", 100),
        };

        const costData = {
            priceM2: readPos("in-precio-m2"),
            structure: readPos("in-estructura"),
            doorWindow: readPos("in-puertaventana"),
            painting: readPos("in-pintura"),
            supplies: readPos("in-insumos"),
            workers: readPos("in-operarios"),
            days: readPos("in-dias"),
            dailyWage: readPos("in-jornal"),
            rental: readPos("in-arriendo"),
            services: readPos("in-servicios"),
            maintenance: readPos("in-mant"),
            management: readPos("in-admin"),
            salePrice: readPos("in-precio-venta"),
        };

        const despProp = readPos("in-desp-prop", 100);
        const x = Math.floor(readPos("in-x"));
        const newBest = calculateImprove(areasData, costData, { wasteNew: despProp, discount: readPos("in-desc", 100) }, x);
        const { area, costs } = newBest.current;

        this.#renderArea(area);
        this.#renderCosts(costs, x);
        this.#renderTable(costs, x);
        this.#renderBests(newBest, areasData.wastePercent, despProp, x);
    }

    /**
     * Metodo privado que inicializa los renders del area principal de la pagina.
     * @param {ReturnType<typeof calculateImprove>["current"]["area"]} area Objetos del area a considerar.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    #renderArea(area) {
        set("out-lamina", fmt(area.sheet, 2));
        set("out-total", fmt(area.total, 2));
        set("out-s", fmt(area.s, 2));
        set("out-paredes", fmt(area.walls, 2));
        set("out-piso", fmt(area.floor, 2));
        set("out-faldones", fmt(area.skirts, 2));
        set("out-frontones", fmt(area.pediments, 2));
        set("out-puerta", fmt(area.door, 2));
        set("out-ventana", fmt(area.window, 2));
    }

    /**
     * Metodo privado que inicializa los renders de los costos principales de la pagina.
     * @param {ReturnType<typeof calculateImprove>["current"]["costs"]} k Modelo de costos a renderizar.
     * @param {number} x Cantidad de unidades a considerar.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    #renderCosts(k, x) {
        set("out-costo-lamina", cop(k.costLamina));
        set("out-x-texto", fmt(x));
        set("out-utilidad-x", cop(k.utility(x)));
        set("out-c", cop(k.c));
        set("out-f", cop(k.F));
        set("out-margen", cop(k.margin));

        if (k.balance === null) {
            set("out-equilibrio", "—");
            set("out-equilibrio-exacto", "margen no positivo");
        } else {
            set("out-equilibrio", fmt(k.balance));
            // @ts-ignore
            set("out-equilibrio-exacto", fmt(k.exactBalance, 2));
        }

        set("fn-costo", `${fmt(k.F)} + ${fmt(k.c)}x`);
        set("fn-ingreso", `${fmt(k.p)}x`);
        set("fn-utilidad", `${fmt(k.margin)}x − ${fmt(k.F)}`);
    }

    /**
     * Metodo privado que renderiza la tabla de produccion.
     * @param {ReturnType<typeof calculateImprove>["current"]["costs"]} k Modelo de costos a evaluar.
     * @param {number} x Cantidad destacada.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    #renderTable(k, x) {
        const cantidades = [...new Set([...productionsBase, x])].filter((n) => n > 0).sort((a, b) => a - b);

        // @ts-ignore
        $("tabla-produccion").innerHTML = k
            .productionTable(cantidades)
            .map(
                (f) => `
            <tr${f.x === x ? ' class="table-active"' : ""}>
                <th scope="row">${f.x}</th>
                <td class="num">${cop(f.cost)}</td>
                <td class="num">${cop(f.income)}</td>
                <td class="num${f.profit < 0 ? " text-danger" : ""}">${cop(f.profit)}</td>
            </tr>`
            )
            .join("");
    }

    /**
     * Metodo privado que renderiza la comparacion de mejoras.
     * @param {ReturnType<typeof calculateImprove>} m Resultado de la comparacion.
     * @param {number} despAct Desperdicio actual.
     * @param {number} despProp Desperdicio propuesto.
     * @param {number} x Unidades a evaluar.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    #renderBests(m, despAct, despProp, x) {
        const act = m.current;
        const prop = m.proposed;

        set("cmp-desp-act", `${fmt(despAct, 1)} %`);
        set("cmp-desp-prop", `${fmt(despProp, 1)} %`);
        set("cmp-area-act", `${fmt(act.area.sheet, 2)} m²`);
        set("cmp-area-prop", `${fmt(prop.area.sheet, 2)} m²`);
        set("cmp-precio-act", cop(act.priceM2));
        set("cmp-precio-prop", cop(prop.priceM2));
        set("cmp-lamina-act", cop(act.costs.costLamina));
        set("cmp-lamina-prop", cop(prop.costs.costLamina));
        set("cmp-c-act", cop(act.costs.c));
        set("cmp-c-prop", cop(prop.costs.c));
        set("cmp-margen-act", cop(act.costs.margin));
        set("cmp-margen-prop", cop(prop.costs.margin));
        set("cmp-eq-act", act.costs.balance === null ? "—" : casetas(act.costs.balance));
        set("cmp-eq-prop", prop.costs.balance === null ? "—" : casetas(prop.costs.balance));
        set("cmp-x", fmt(x));
        set("cmp-util-act", cop(act.utility));
        set("cmp-util-prop", cop(prop.utility));

        set("out-ahorro", cop(m.savings));
        set("out-aumento", m.profitIncrease === null ? "—" : `${m.profitIncrease >= 0 ? "+" : "−"}${fmt(Math.abs(m.profitIncrease) * 100, 1)} %`);
    }

    /**
     * Metodo privado que inicializa el cambio de tema claro y oscuro.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    #initTheme() {
        this.#updateBtnTheme(this.root.dataset.tema === "oscuro");

        this.sysTheme.addEventListener("change", ({ matches }) => {
            if (!localStorage.getItem(this.keyTheme)) {
                this.root.dataset.tema = matches ? "oscuro" : "claro";
                this.#updateBtnTheme(matches);
            }
        });

        this.btnTheme.addEventListener("click", () => {
            const oscuro = this.root.dataset.tema !== "oscuro";

            this.root.dataset.tema = oscuro ? "oscuro" : "claro";

            localStorage.setItem(this.keyTheme, oscuro ? "oscuro" : "claro");

            this.#updateBtnTheme(oscuro);
        });
    }

    /**
     * Metodo privado que actualiza el estado visual del boton de tema.
     * @param {boolean} oscuro Indica si el modo oscuro esta activo.
     * @returns {void}
     * @author HaJuegos - 20-11-2026
     */
    #updateBtnTheme(oscuro) {
        this.btnTheme.setAttribute("aria-pressed", String(oscuro));
        this.btnTheme.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
        // @ts-ignore
        this.btnTheme.querySelector("i").className = oscuro ? "bi bi-sun me-1" : "bi bi-moon-stars me-1";
        // @ts-ignore
        this.btnTheme.querySelector("span").textContent = oscuro ? "Modo claro" : "Modo oscuro";
    }
}

new ViewCaseta().init();
