<script module lang="ts">
import type { Summary } from "../../lib/transaction.svelte";
import { ArcElement, BarController, BarElement, CategoryScale, Chart, Colors, LinearScale, PieController, Tooltip } from "chart.js";

Chart.register(
  BarController,
  BarElement,

  PieController,
  ArcElement,

  LinearScale,
  CategoryScale,

  Tooltip,
  Colors,
);

interface Prop { summary: Summary }

function chart(canvas: HTMLCanvasElement, prop: Prop) {
  const chart = new Chart(canvas, {
    type: 'bar',
    options: {
      plugins: {
        // legend: { display: false } /** top chart label */
        // tooltip: { enabled: false }
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
          grid: { display: false },
          border: { color: '#fff' }
        },
        y: {
          ticks: { color: '#fff' },
          grid: { display: false },
          border: { color: '#fff' }
        },
      }
    },
    data: {
      labels: prop.summary.map(e => e.label.slice(0,3)),
      datasets: [{
        label: 'kas bulanan',
        data: prop.summary.map(e => e.total),
        borderRadius: 4,
        backgroundColor: '#fff',
      }]
    },
  });
  $effect(() => {
    const summary = prop.summary//.slice(-9,-1);
    chart.data.labels = summary.map(e => e.label.slice(0,3));
    chart.data.datasets = [{
      label: 'kas bulanan',
      data: summary.map(e => e.total),
      borderRadius: 4,
      backgroundColor: '#fff',
    }];
    chart.update()
  })
}

</script>

<script lang="ts">
  let prop: Prop = $props();
</script>

<canvas use:chart={prop} width="100%"></canvas>

