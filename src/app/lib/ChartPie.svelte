<script module lang="ts">
import { Chart } from "chart.js";

interface Prop {
  input: number
  output: number
}

function chart(canvas: HTMLCanvasElement, prop: Prop) {
  const chart = new Chart(canvas, {
    type: "pie",
    options: {
      responsive: false
    },
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [
        {
          label: "Saldo Kas",
          data: [prop.input, prop.output],
          backgroundColor: [
            "#43d63c",
            "#e32729",
          ],
          borderWidth: 0,
        },
      ],
    },
  });

}

</script>

<script lang="ts">
  let prop: Prop = $props();
</script>

<canvas use:chart={prop} height="96" width="96"></canvas>

