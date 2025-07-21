import { GameOfLife } from '../../src/GameOfLife';

describe('Game of Life', () => {
    const game = new GameOfLife({
        cntRows: 500,
        cntCols: 500,
    });

    beforeEach(async () => {
        game.resetGame();
    })
    afterAll(async () => {
    })

    describe('Main', () => {
        it('Game state should be properly set', async () => {
            game.setState([{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }]);

            expect(game.getAliveCells()).toStrictEqual([{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }]);
            expect(game.getCntGenerations()).toBe(0);
        });

        it('Generations should increase properly', async () => {
            game.setState([{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }]);
            expect(game.getCntGenerations()).toBe(0);

            game.processGeneration();
            expect(game.getCntGenerations()).toBe(1);
            
            game.processGeneration();
            expect(game.getCntGenerations()).toBe(2);
            
            game.processGeneration();
            expect(game.getCntGenerations()).toBe(3);
        });

        it('It should produce a simple oscillator', async () => {
            const states = [
                // initial state
                [
                    {
                        col: 31,
                        row: 17
                    },
                    {
                        col: 32,
                        row: 17
                    },
                    {
                        col: 33,
                        row: 17
                    }
                ],
                // state after 1 generation
                [
                    {
                        col: 32,
                        row: 16
                    },
                    {
                        col: 32,
                        row: 17
                    },
                    {
                        col: 32,
                        row: 18
                    }
                ],
                // now it should return to the initial state
            ];

            game.setState(JSON.parse(JSON.stringify(states[0])));
            expect(game.getAliveCells()).toStrictEqual(JSON.parse(JSON.stringify(states[0])));

            for (let i = 0; i < 10; i++) {
                game.processGeneration();

                const isEven = i % 2 === 0;
                expect(game.getAliveCells()).toStrictEqual(JSON.parse(JSON.stringify(states[isEven ? 1 : 0])));
            }
        });
    })

})