<template>
    <div id="app">
        <h1>Demonstration of the PayoffMatrix Component</h1>
        <p>
            The PayoffMatrix Vue.js component displays payoff matrices for two players, pure dominant strategies for both players, as well as pure strategy Nash equilibria.
        </p>   
        <p>
            The component automatically highlights player 1&apos;s weakly dominant strategies in <span style="background-color: #DDF;">light blue</span>, player 1&apos;s strictly dominant strategy in <span style="background-color: #BBF;">dark blue</span>, player 2&apos;s weakly dominant strategies in <span style="background-color: #FDD;">light red</span>, and player 2&apos;s strictly dominant strategy in <span style="background-color: #FBB;">dark red</span>. Furthermore, weak pure strategy Nash equilibria are <span style="text-decoration: underline;">underlined</span> while strict pure strategy Nash equlibria are displayed in <span style="text-decoration: underline; font-weight: bold;">bold as well</span>.
        </p>
        <h2>Prisoner&apos;s Dilemma</h2>
        <p>
            <code>
                &lt;PayoffMatrix :payoffs=&quot;[[2, 2, 0, 3], [3, 0, 1, 1]]&quot;<br />
                :player1Strategies=&quot;['Cooperate', 'Defect']&quot;<br />
                :player2Strategies=&quot;['Cooperate', 'Defect']&quot;<br />
                :showResultsAsText=&quot;false&quot; /&gt;
            </code>
        </p>
        <PayoffMatrix
            :payoffs="[
                [2, 2, 0, 3],
                [3, 0, 1, 1],
            ]"
            :player1Strategies="['Cooperate', 'Defect']"
            :player2Strategies="['Cooperate', 'Defect']"
            :showResultsAsText="false"
        />
        <h2>Stag Hunt</h2>
        <p>
            <code>
                &lt;PayoffMatrix :payoffs=&quot;[2, 2, 0, 3], [3, 0, 1, 1]]&quot;<br />
                :player1Strategies=&quot;['Stag', 'Hare']&quot;<br />
                :player2Strategies=&quot;['Stag', 'Hare']&quot;<br />
                :readOnly=&quot;true&quot; /&gt;
            </code>
        </p>
        <PayoffMatrix
            :payoffs="[
                [10, 10, 1, 8],
                [8, 1, 5, 5],
            ]"
            :player1Strategies="['Stag', 'Hare']"
            :player2Strategies="['Stag', 'Hare']"
            :readOnly="true"
        />
        <h2>3 &times; 3 Payoff Matrix</h2>
        <p>
            <code>
                &lt;PayoffMatrix :payoffs=&quot;[[10, 0, 15, 10, 10, 2], [0, 0, 0, 10, 5, 10], [10, 5, 15, 10, 10, 10]]&quot;<br />
                :player1Strategies=&quot;['Option A', 'Option B', 'Option C']&quot;<br />
                :player2Strategies=&quot;['Option A', 'Option B', 'Option C']&quot; /&gt;
            </code>
        </p>
        <PayoffMatrix
            :payoffs="[
                [10, 0, 15, 10, 10, 2],
                [0, 0, 0, 10, 5, 10],
                [10, 5, 15, 10, 10, 10],
            ]"
            :player1Strategies="['Option A', 'Option B', 'Option C']"
            :player2Strategies="['Option A', 'Option B', 'Option C']"
        />
    </div>
</template>

<script>
import PayoffMatrix from '@/components/PayoffMatrix.vue'

export default {
    name: 'App',
    components: {
        PayoffMatrix
    }
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

</style>
