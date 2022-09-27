<template>
    <div id="wrapper">
        <table class="payoff-matrix">
            <tbody>
                <tr>
                    <td colspan="2" rowspan="2" class="emptycell"></td>
                    <td :colspan="player2StrategiesInternal.length * 2" class="playername player2">Player 2</td>
                </tr>
                <tr>
                    <td
                        v-for="(strategy, index) in player2StrategiesInternal"
                        :key="index"
                        colspan="2"
                        :class="{
                            weaklyDominantStrategyPlayer2: player2WeaklyDominantStrategies.includes(index),
                            strictlyDominantStrategyPlayer2: player2StrictlyDominantStrategies.includes(index)
                        }"
                    >
                        <input v-if="!readOnly" type="text" v-model.number="player2StrategiesInternal[index]" @change="updatePayoffMatrixWrapper" />
                        <span v-if="readOnly">{{ player2StrategiesInternal[index] }}</span>
                    </td>
                </tr>
                <tr v-for="(payoffsRow, index1) in payoffsInternal" :key="index1">
                    <td v-if="index1 == 0" :rowspan="player1StrategiesInternal.length" class="playername player1">Player 1</td>
                    <td
                        v-if="index1 < player1StrategiesInternal.length"
                        :class="{
                            weaklyDominantStrategyPlayer1: player1WeaklyDominantStrategies.includes(index1),
                            strictlyDominantStrategyPlayer1: player1StrictlyDominantStrategies.includes(index1)
                        }"
                    >
                        <input v-if="!readOnly" type="text" v-model.number="player1StrategiesInternal[index1]" @change="updatePayoffMatrixWrapper" />
                        <span v-if="readOnly">{{ player1StrategiesInternal[index1] }}</span>
                    </td>
                    <td
                        v-for="(payoffsCell, index2) in payoffsRow"
                        :key="index2"
                        :class="{
                            weaklyDominantStrategyPlayer1: player1WeaklyDominantStrategies.includes(index1),
                            strictlyDominantStrategyPlayer1: player1StrictlyDominantStrategies.includes(index1), 
                            weaklyDominantStrategyPlayer2: player2WeaklyDominantStrategies.includes(index2 / 2) || player2WeaklyDominantStrategies.includes((index2 - 1) / 2),
                            strictlyDominantStrategyPlayer2: player2StrictlyDominantStrategies.includes(index2 / 2) || player2StrictlyDominantStrategies.includes((index2 - 1) / 2),
                        }"
                    >
                        <input
                            type="number"
                            v-if="!readOnly"
                            v-model.number="payoffsInternal[index1][index2]"
                            @change="updatePayoffMatrixWrapper"
                            :class="{
                                player1: index2 % 2 == 0, 
                                player2: index2 % 2 == 1, 
                                weakNashEquilibrium: weakNashEquilibria.some(element => {return element[0] == index1 && (element[1] == index2 / 2 || element[1] == (index2 - 1) / 2)}),
                                strictNashEquilibrium: strictNashEquilibria.some(element => {return element[0] == index1 && (element[1] == index2 / 2 || element[1] == (index2 - 1) / 2)}),
                            }"
                        />
                        <span
                            v-if="readOnly"
                            :class="{
                                player1: index2 % 2 == 0, 
                                player2: index2 % 2 == 1, 
                                weakNashEquilibrium: weakNashEquilibria.some(element => {return element[0] == index1 && (element[1] == index2 / 2 || element[1] == (index2 - 1) / 2)}),
                                strictNashEquilibrium: strictNashEquilibria.some(element => {return element[0] == index1 && (element[1] == index2 / 2 || element[1] == (index2 - 1) / 2)}),
                            }"
                        >
                            {{ payoffsInternal[index1][index2] }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <p id="results" v-if="showResultsAsText" v-html="resultsString"></p>
        <button v-if="!liveUpdate" @click="updatePayoffMatrix">Update</button>
    </div>
</template>

<script>

export default {
    name: 'PayoffMatrix',
    props: {
        payoffs: {
            type: Array,
            required: true,
            validator(elements) {
                return elements.every(element => {return element.length % 2 == 0})
            } 
        },
        player1Strategies: {
            type: Array,
            required: true,
        },
        player2Strategies: {
            type: Array,
            required: true,
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        showResultsAsText: {
            type: Boolean,
            default: true,
        },
        liveUpdate: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            player1StrategiesInternal: [],
            player2StrategiesInternal: [],
            payoffsInternal: [],
            player1PayoffsInColumn: [],
            player2PayoffsInRow: [],
            player1BestStrategiesPerColumn: [],
            player2BestStrategiesPerRow: [],
            player1WeaklyDominantStrategies: [],
            player2WeaklyDominantStrategies: [],
            player1StrictlyDominantStrategies: [],
            player2StrictlyDominantStrategies: [],
            weakNashEquilibria: [],
            strictNashEquilibria: [],
            resultsString: '',
        }
    },
    methods: {

        // helper method that returns the indices of all elements of an array with a specific value
        getAllIndicesWithValue(array, value) {
            var indexes = [], i
            for(i = 0; i < array.length; i++)
                if (array[i] === value)
                    indexes.push(i)
            return indexes
        },

        // helper method that returns the intersection of multiple arrays
        arrayIntersection() {
            var result = []
            var lists

            if(arguments.length === 1) {
                lists = arguments[0]
            } else {
                lists = arguments
            }

            for(var i = 0; i < lists.length; i++) {
                var currentList = lists[i]
                for(var y = 0; y < currentList.length; y++) {
                    var currentValue = currentList[y]
                    if(result.indexOf(currentValue) === -1) {
                        var existsInAll = true
                        for(var x = 0; x < lists.length; x++) {
                            if(lists[x].indexOf(currentValue) === -1) {
                                existsInAll = false
                                break
                            }
                        }
                        if(existsInAll) {
                            result.push(currentValue)
                        }
                    }
                }
            }
            return result
        },

        // helper function to remove HTML from inputs to avoid XSS
        removeHTML(originalString) {
            return originalString.replace(/(<([^>]+)>)/gi, "")
        },

        // function is called whenever an update is carried out; however, it only triggers updatePayoffMatrix if liveUpdate is switched on 
        updatePayoffMatrixWrapper() {
            if(this.liveUpdate) this.updatePayoffMatrix()
        },

        updatePayoffMatrix() {
            this.loadInternalData()
            this.computeDominantStrategies()
            this.computeNashEquilibria()
            this.showResultText()
        },

        loadInternalData() {
            // load data from props
            this.player1StrategiesInternal = this.player1Strategies
            this.player2StrategiesInternal = this.player2Strategies
            this.payoffsInternal = this.payoffs

            // compute payoff submatrices for each player
            this.player1PayoffsInColumn = []
            this.player2PayoffsInRow = []
            this.player1StrategiesInternal.forEach(() => this.player2PayoffsInRow.push([]))
            this.player2StrategiesInternal.forEach(() => this.player1PayoffsInColumn.push([]))
            this.payoffsInternal.forEach(currentRow => {
                currentRow.forEach((currentCell, columnIndex) => {
                    if(columnIndex % 2 == 0) {
                        this.player1PayoffsInColumn[columnIndex / 2].push(currentCell)
                    }
                })
            })
            this.payoffsInternal.forEach((currentRow, rowIndex) => {
                currentRow.forEach((currentCell, columnIndex) => {
                    if(columnIndex % 2 == 1) {
                        this.player2PayoffsInRow[rowIndex].push(currentCell)
                    }
                })
            })

            // compute strategies for each player depending on the action of the opponent
            this.player1BestStrategiesPerColumn = []
            this.player2BestStrategiesPerRow = []
            this.player1PayoffsInColumn.forEach(current => {
                this.player1BestStrategiesPerColumn.push(this.getAllIndicesWithValue(current, Math.max(...current)))
            })
            this.player2PayoffsInRow.forEach(current => {
                this.player2BestStrategiesPerRow.push(this.getAllIndicesWithValue(current, Math.max(...current)))
            })
        },

        computeDominantStrategies() {
            this.player1WeaklyDominantStrategies = this.arrayIntersection(this.player1BestStrategiesPerColumn)
            this.player2WeaklyDominantStrategies = this.arrayIntersection(this.player2BestStrategiesPerRow)

            if(this.player1BestStrategiesPerColumn.every(strategies => strategies.length == 1)) {
                this.player1StrictlyDominantStrategies = [this.player1WeaklyDominantStrategies[0]]
            } else {
                this.player1StrictlyDominantStrategies = []
            }
            if(this.player2BestStrategiesPerRow.every(strategies => strategies.length == 1)) {
                this.player2StrictlyDominantStrategies = [this.player2WeaklyDominantStrategies[0]]
            } else {
                this.player2StrictlyDominantStrategies = []
            }
            
        },

        computeNashEquilibria() {
            this.weakNashEquilibria = []
            this.strictNashEquilibria = []
            
            for(let index1 = 0; index1 < this.player1StrategiesInternal.length; index1++) {
                for(let index2 = 0; index2 < this.player2StrategiesInternal.length; index2++) {

                    // The first condition asks if the cell in column index1 and row index2 yields the maximum payoff for player 1 while the second condition asks if this cell yields the maximum payoff for player 2 
                    if (this.player1BestStrategiesPerColumn[index2].includes(index1) && this.player2BestStrategiesPerRow[index1].includes(index2)) {
                        this.weakNashEquilibria.push([index1, index2])
                        
                        // determine if equilibrium counts as strict as well
                        if(this.player1BestStrategiesPerColumn[index2].length == 1 && this.player2BestStrategiesPerRow[index1].length == 1) {
                            this.strictNashEquilibria.push([index1, index2])
                        }
                    }
                }
            }
        },
        
        showResultText() {
            this.resultsString = '<strong>Strictly Dominant Pure Strategies for Player 1:</strong> ' + this.removeHTML(this.player1StrictlyDominantStrategies.map(strategyIndex => {return this.player1StrategiesInternal[strategyIndex]}).join(', ')) + '<br /> '
            this.resultsString += '<strong>Weakly Dominant Pure Strategies for Player 1:</strong> ' + this.removeHTML(this.player1WeaklyDominantStrategies.map(strategyIndex => {return this.player1StrategiesInternal[strategyIndex]}).join(', ')) + '<br /> '
            this.resultsString += '<strong>Strictly Dominant Pure Strategies for Player 2:</strong> ' + this.removeHTML(this.player2StrictlyDominantStrategies.map(strategyIndex => {return this.player2StrategiesInternal[strategyIndex]}).join(', ')) + '<br /> '
            this.resultsString += '<strong>Weakly Dominant Pure Strategies for Player 2:</strong> ' + this.removeHTML(this.player2WeaklyDominantStrategies.map(strategyIndex => {return this.player2StrategiesInternal[strategyIndex]}).join(', ')) + '<br /> '
            this.resultsString += '<strong>Strict Pure Strategy Nash Equilibria:</strong> ' + this.removeHTML(this.strictNashEquilibria.map(equilibrium => {return '(' + this.player1StrategiesInternal[equilibrium[0]] + ', ' + this.player2StrategiesInternal[equilibrium[1]] + ')'}).join(', ')) + '<br /> '
            this.resultsString += '<strong>Weak Pure Strategy Nash Equilibria:</strong> ' + this.removeHTML(this.weakNashEquilibria.map(equilibrium => {return '(' + this.player1StrategiesInternal[equilibrium[0]] + ', ' + this.player2StrategiesInternal[equilibrium[1]] + ')'}).join(', ')) + '<br /> '
            
        },
    },
    mounted() {
        this.updatePayoffMatrix()
    },
}

</script>

<style scoped>

#wrapper {
    font-size: 12pt;
    margin: 0 0 20px 0;
}

.payoff-matrix {
    border-collapse: collapse;
    margin: 0 0 10px 0;
    padding: 0;
    width: 100%;
    table-layout: fixed;
}

.payoff-matrix td {
    padding: .625em;
    border: 1px solid #DDD;
    background-color: #f8f8f8;
    text-align: center;
}

.payoff-matrix .emptycell {
    background-color: transparent;
    border: none;
}

.payoff-matrix .weaklyDominantStrategyPlayer1 {
    background-color: #DDF;
}

.payoff-matrix .strictlyDominantStrategyPlayer1 {
    background-color: #BBF;
}

.payoff-matrix .weaklyDominantStrategyPlayer2 {
    background-color: #FDD;
}

.payoff-matrix .strictlyDominantStrategyPlayer2 {
    background-color: #FBB;
}

.payoff-matrix .weaklyDominantStrategyPlayer1.weaklyDominantStrategyPlayer2 {
    background-color: #DCD;
}

.payoff-matrix .weaklyDominantStrategyPlayer1.strictlyDominantStrategyPlayer2 {
    background-color: #DAB;
}

.payoff-matrix .strictlyDominantStrategyPlayer1.weaklyDominantStrategyPlayer2 {
    background-color: #BAD;
}

.payoff-matrix .strictlyDominantStrategyPlayer1.strictlyDominantStrategyPlayer2 {
    background-color: #B9B;
}

.payoff-matrix .weakNashEquilibrium {
    font-weight: bold;
}

.payoff-matrix .strictNashEquilibrium {
    text-decoration: underline;
}

.payoff-matrix input[type='number'] {
    width: 40px;
    border: none;
    text-align: center;
    background-color: transparent;
}

.payoff-matrix input[type='text'] {
    color: #2c3e50;
    font-size: 100%;
    width: 100%;
    border: none;
    text-align: center;
    background-color: transparent;
}

.playername {
    font-size: .85em;
    letter-spacing: .1em;
    text-transform: uppercase;
}

.player1 {
    color: #00C;
}

.player2 {
    color: #C00;
}

</style>
