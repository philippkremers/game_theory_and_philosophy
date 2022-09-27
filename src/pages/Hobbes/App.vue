<template>
    <h1>Hobbes’s Social Theory <span style="font-weight: normal;">(according to Rawls, Barry, and Gauthier)</span></h1>

    <p>
        John Rawls (1971/1999: 238), Brian Barry (1965: 253&ndash;4), and David Gauthier (1983: 291&ndash;310) claim that Hobbes’s state of nature is best modelled as a one-off prisoner’s dilemma.
    </p>

    <hr />

    <p style="text-align: center;">
        <strong>State of Nature</strong>
        <toggle-switch :default="false" @switchFlipped="switchFlipped" style="margin: 0 20px;" />
        <strong>State of Society</strong>
    </p>

    <PayoffMatrix
        :payoffs="currentPayoffMatrix"
        :key="isStateOfSociety"
        :player1Strategies="['Cooperate', 'Defect']"
        :player2Strategies="['Cooperate', 'Defect']"
        :readOnly="true"  
    />

    <h1>Hobbes’s Social Theory <span style="font-weight: normal;">(according to Kavka, Vanderschraaf, and Moehler)</span></h1>
    
    <p>Gregory Kavka (1989), Peter Vanderschraaf (2006: 252), and Michael Moehler (2009) claim that Hobbes’s state of nature is best modelled as an assurance game.</p>

    <PayoffMatrix
        :payoffs="[[4, 4, -2, 3], [3, -2, 0, 0]]"
        :player1Strategies="['Cooperate', 'Defect']"
        :player2Strategies="['Cooperate', 'Defect']"
        :readOnly="false"  
    />
</template>

<script>
import PayoffMatrix from '@/components/PayoffMatrix.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
    name: 'App',
    components: {
        PayoffMatrix,
        ToggleSwitch,
    },
    methods: {
        switchFlipped(isStateOfSociety) {
            this.isStateOfSociety = isStateOfSociety

            if(isStateOfSociety) {
                this.currentPayoffMatrix = this.stateOfSocietyPayoffMatrix
            } else {
                this.currentPayoffMatrix = this.stateOfNaturePayoffMatrix
            }
        },
    },
    data() {
        return {
            stateOfNaturePayoffMatrix: [[4, 4, -2, 6], [6, -2, 0, 0]],
            stateOfSocietyPayoffMatrix: [[4, 4, 3, -2], [-2, 3, 0, 0]],
            currentPayoffMatrix: [],
            isStateOfSociety: false,
        }
    },
    created() {
        this.currentPayoffMatrix = this.stateOfNaturePayoffMatrix
    },
}
</script>

<style>

body {
    margin: 0 20px;
}

#app {
    font-size: 12pt;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
}

h1, h2 {
    border-bottom: 1px solid #DDD;
}

hr {
    height: 1px;
    border-width: 0;
    background-color: #DDD;
}

</style>