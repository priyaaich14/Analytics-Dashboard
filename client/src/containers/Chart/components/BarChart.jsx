import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { semanticColors } from "@nextui-org/react";
import { cloneDeep } from "lodash";

import KpiChartSegment from "./KpiChartSegment";
import ChartErrorBoundary from "./ChartErrorBoundary";
import { useTheme } from "../../../modules/ThemeContext";
import { getHeightBreakpoint, getWidthBreakpoint } from "../../../modules/layoutBreakpoints";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, Filler
);

function BarChart(props) {
  const {
    chart, redraw, redrawComplete, editMode,
  } = props;

  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";
  const chartRef = useRef(null);

  useEffect(() => {
    if (redraw) {
      setTimeout(() => {
        redrawComplete();
      }, 1000);
    }
  }, [redraw]);

  const _getChartOptions = () => {
    // add any dynamic changes to the chartJS options here
    if (chart.chartData?.options) {
      const newOptions = cloneDeep(chart.chartData.options);
      if (newOptions.scales?.y?.grid) {
        newOptions.scales.y.grid.color = semanticColors[theme].content3.DEFAULT
      }
      if (newOptions.scales?.x?.grid) {
        newOptions.scales.x.grid.color = semanticColors[theme].content3.DEFAULT
      }
      if (newOptions.scales?.y?.ticks) {
        newOptions.scales.y.ticks.color = semanticColors[theme].foreground.DEFAULT;
      }
      if (newOptions.scales?.x?.ticks) {
        newOptions.scales.x.ticks.color = semanticColors[theme].foreground.DEFAULT;
      }
      if (newOptions.plugins?.legend?.labels) {
        newOptions.plugins.legend.labels.color = semanticColors[theme].foreground.DEFAULT;
      }

      if (newOptions?.scales?.x?.ticks && newOptions?.scales?.y?.ticks) {
        // sizing changes
        const widthBreakpoint = chart.horizontal ? getHeightBreakpoint(chartRef) : getWidthBreakpoint(chartRef);
        const heightBreakpoint = chart.horizontal ? getWidthBreakpoint(chartRef) : getHeightBreakpoint(chartRef);

        if (widthBreakpoint === "xxs" || widthBreakpoint === "xs") {
          newOptions.elements.point.radius = 0;
        } else {
          newOptions.elements.point.radius = chart.chartData?.options?.elements?.point?.radius;
        }

        const realX = chart.horizontal ? "y" : "x";
        const realY = chart.horizontal ? "x" : "y";

        if (widthBreakpoint === "xxs" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 4;
          newOptions.scales[realX].ticks.maxRotation = 25;
        } else if (widthBreakpoint === "xs" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 6;
          newOptions.scales[realX].ticks.maxRotation = 25;
        } else if (widthBreakpoint === "sm" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 8;
          newOptions.scales[realX].ticks.maxRotation = 25;
        } else if (widthBreakpoint === "md" && chart.xLabelTicks === "default") {
          newOptions.scales[realX].ticks.maxTicksLimit = 12;
          newOptions.scales[realX].ticks.maxRotation = 90;
        } else if (!chart.xLabelTicks) {
          newOptions.scales[realX].ticks.maxTicksLimit = 16;
        }

        if (heightBreakpoint === "xs") {
          newOptions.scales[realY].ticks.maxTicksLimit = 4;
        } else {
          newOptions.scales[realY].ticks.maxTicksLimit = 10;
        }
      }

      return newOptions;
    }

    return chart.chartData?.options;
  };

  const _getDatalabelsOptions = () => {
    return {
      font: {
        weight: "bold",
        size: 10,
        family: "Inter",
        color: "white"
      },
      padding: 4,
      borderRadius: 4,
      formatter: Math.round,
    };
  };

  const _getChartData = () => {
    if (!chart?.chartData?.data?.datasets) return chart.chartData.data;

    const newChartData = cloneDeep(chart.chartData.data);

    newChartData?.datasets?.forEach((dataset, index) => {
      if (dataset?.datalabels && index === chart.chartData.data.datasets.length - 1) {
        newChartData.datasets[index].datalabels.color = semanticColors[theme].default[800];
      }
    });

    return newChartData;
  };

  return (
    <>
      {chart.chartData && chart.chartData.data && (
        <div className="h-full" ref={chartRef}>
          {chart.chartData.growth && chart.mode === "kpichart" && (
            <KpiChartSegment chart={chart} editMode={editMode} />
          )}
          {chart.chartData.data && chart.chartData.data.labels && (
            <div className={chart.mode !== "kpichart" ? "h-full" : "h-full pb-[50px]"}>
              <ChartErrorBoundary>
                <Bar
                  data={_getChartData()}
                  options={{
                    ..._getChartOptions(),
                    plugins: {
                      ..._getChartOptions().plugins,
                      datalabels: chart.dataLabels && _getDatalabelsOptions(),
                    },
                  }}
                  redraw={redraw}
                  plugins={chart.dataLabels ? [ChartDataLabels] : []}
                />
              </ChartErrorBoundary>
            </div>
          )}
        </div>
      )}
    </>
  );
}

BarChart.defaultProps = {
  redraw: false,
  redrawComplete: () => {},
  editMode: false,
};

BarChart.propTypes = {
  chart: PropTypes.object.isRequired,
  redraw: PropTypes.bool,
  redrawComplete: PropTypes.func,
  editMode: PropTypes.bool,
};

export default BarChart;
