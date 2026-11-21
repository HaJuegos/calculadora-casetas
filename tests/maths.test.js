import { describe, expect, it } from "vitest";
import { calculateImprove } from "../src/js/maths.js";

const areaData = {
    a: 1.5,
    l: 2,
    h: 2.3,
    t: 0.4,
    doorW: 0.8,
    doorH: 2,
    windowW: 1,
    windowH: 0.8,
    wastePercent: 10,
};

const costData = {
    priceM2: 37000,
    structure: 480000,
    doorWindow: 420000,
    painting: 120000,
    supplies: 90000,
    workers: 2,
    days: 3,
    dailyWage: 90000,
    rental: 1800000,
    services: 450000,
    maintenance: 350000,
    management: 600000,
    salePrice: 4000000,
};

describe("calculateImprove", () => {
    it("uses the same area and cost input names as the page", () => {
        const result = calculateImprove(areaData, costData, { wasteNew: 5, discount: 8 }, 8);

        expect(result.current.area.total).toBeCloseTo(20.7);
        expect(result.current.area.sheet).toBeCloseTo(22.77);
        expect(result.current.area.door).toBeCloseTo(1.6);
        expect(result.current.area.window).toBeCloseTo(0.8);
        expect(result.current.costs).toMatchObject({
            costLamina: 842490,
            c: 2492490,
            F: 3200000,
            balance: 3,
        });
        expect(result.current.utility).toBe(8860080);
    });

    it("returns the proposed scenario and production rows with their documented fields", () => {
        const result = calculateImprove(areaData, costData, { wasteNew: 5, discount: 8 }, 8);

        expect(result.proposed.area.sheet).toBeCloseTo(21.735);
        expect(result.proposed.priceM2).toBe(34040);
        expect(result.proposed.costs.c).toBe(2389859);
        expect(result.proposed.utility).toBe(9681128);
        expect(result.savings).toBe(821048);
        expect(result.profitIncrease).toBeCloseTo(0.092668, 5);
        expect(result.current.costs.productionTable([2])).toEqual([
            { x: 2, cost: 8184980, income: 8000000, profit: -184980 },
        ]);
    });
});
