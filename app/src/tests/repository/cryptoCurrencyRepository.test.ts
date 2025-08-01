import { CryptoCurrencyRepository } from "../../repository/cryptoCurrencyRepository";
import { prisma } from "../../utils/database";

jest.mock("../../utils/database", () => ({
    prisma: {
        cryptoCurrency: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe("CryptoCurrencyRepository", () => {
    let repository: CryptoCurrencyRepository;

    beforeEach(() => {
        repository = new CryptoCurrencyRepository();
        jest.clearAllMocks();
    });

    describe("findCryptos", () => {
        it("should return cryptos and requisition infos with default limit/offset", async () => {
            (prisma.cryptoCurrency.count as jest.Mock).mockResolvedValue(42);
            (prisma.cryptoCurrency.findMany as jest.Mock).mockResolvedValue([{ id: 1, name: "BTC" }]);

            const params = {};
            const result = await repository.findCryptos(params);

            expect(prisma.cryptoCurrency.count).toHaveBeenCalled();
            expect(prisma.cryptoCurrency.findMany).toHaveBeenCalledWith({
                where: {},
                take: 100,
                skip: 0,
            });
            expect(result).toEqual({
                cryptos: [{ id: 1, name: "BTC" }],
                cryptoCurrencyRequisitionInfos: {
                    limit: 100,
                    offset: 0,
                    count: 42,
                },
            });
        });

        it("should parse limit and offset from params", async () => {
            (prisma.cryptoCurrency.count as jest.Mock).mockResolvedValue(10);
            (prisma.cryptoCurrency.findMany as jest.Mock).mockResolvedValue([{ id: 2, name: "ETH" }]);

            const params = { limit: "5", offset: "2" };
            await repository.findCryptos(params);

            expect(prisma.cryptoCurrency.findMany).toHaveBeenCalledWith({
                where: {},
                take: 5,
                skip: 2,
            });
        });

        it("should pass filterParams to findMany", async () => {
            (prisma.cryptoCurrency.count as jest.Mock).mockResolvedValue(1);
            (prisma.cryptoCurrency.findMany as jest.Mock).mockResolvedValue([{ id: 3, name: "DOGE" }]);

            const params = { symbol: "DOGE", limit: "1", offset: "0" };
            await repository.findCryptos(params);

            expect(prisma.cryptoCurrency.findMany).toHaveBeenCalledWith({
                where: { symbol: "DOGE" },
                take: 1,
                skip: 0,
            });
        });
    });

    describe("orderCryptos", () => {
        it("should return cryptos and requisition infos with ordering", async () => {
            (prisma.cryptoCurrency.count as jest.Mock).mockResolvedValue(5);
            (prisma.cryptoCurrency.findMany as jest.Mock).mockResolvedValue([{ id: 4, name: "ADA" }]);

            const params = { limit: "2", offset: "1" };
            const removingNullValues = [{ symbol: { not: null } }];
            const orderByArray = [{ name: "asc" }];

            const result = await repository.orderCryptos(params, removingNullValues, orderByArray);

            expect(prisma.cryptoCurrency.count).toHaveBeenCalled();
            expect(prisma.cryptoCurrency.findMany).toHaveBeenCalledWith({
                take: 2,
                skip: 1,
                where: { AND: removingNullValues },
                orderBy: orderByArray,
            });
            expect(result).toEqual({
                cryptos: [{ id: 4, name: "ADA" }],
                cryptoCurrencyRequisitionInfos: {
                    limit: 2,
                    offset: 1,
                    count: 5,
                },
            });
        });

        it("should use default limit/offset if not provided", async () => {
            (prisma.cryptoCurrency.count as jest.Mock).mockResolvedValue(0);
            (prisma.cryptoCurrency.findMany as jest.Mock).mockResolvedValue([]);

            const params = {};
            const removingNullValues = [];
            const orderByArray = [];

            await repository.orderCryptos(params, removingNullValues, orderByArray);

            expect(prisma.cryptoCurrency.findMany).toHaveBeenCalledWith({
                take: 100,
                skip: 0,
                where: { AND: [] },
                orderBy: [],
            });
        });
    });
});