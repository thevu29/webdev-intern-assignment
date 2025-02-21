import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { BarChartData } from "../../types/types";

interface BarChartProps {
  title: string;
  categories: string[];
  series: BarChartData[];
}

const BarChart = (props: BarChartProps) => {
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: props.title,
      style: {
        fontSize: "20px",
      },
    },
    xAxis: {
      categories: props.categories,
      crosshair: true,
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Number of scores",
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        groupPadding: 0.08,
      },
    },
    series: props.series,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default BarChart;
