import React from "react";
import PropTypes from "prop-types";
import {
  Header, Icon, Popup, Segment
} from "semantic-ui-react";

import { Colors } from "../../../config/colors";

function KpiChartSegment(props) {
  const { chart } = props;
  return (
    <Segment.Group horizontal style={styles.growthContainer} compact>
      {chart.chartData.growth.map((c, index) => (
        <Segment basic compact key={c.label}>
          <Header size={chart.chartSize === 1 ? "normal" : "large"}>
            {`${c.value} `}
            {chart.showGrowth && (
              <Popup
                trigger={(
                  <small style={{ fontSize: "0.6em" }}>
                    <Icon
                      name={`arrow circle ${(c.status === "positive" && "up") || "down"}`}
                      color={
                        c.status === "positive" ? "green" : c.status === "negative" ? "red" : "grey"
                      }
                    />
                    <span style={{ color: Colors[c.status] }}>
                      {`${c.comparison}%`}
                    </span>
                  </small>
                )}
                inverted
                content={
                  `Compared to last ${chart.timeInterval}`
                }
                size="tiny"
              />
            )}
            <Header.Subheader style={chart.chartSize === 1 ? { fontSize: "0.8em" } : {}}>
              <span
                style={
                  chart.Datasets
                  && styles.datasetLabelColor(chart.Datasets[index].datasetColor)
                }
              >
                {c.label}
              </span>
            </Header.Subheader>
          </Header>
        </Segment>
      ))}
    </Segment.Group>
  );
}

const styles = {
  growthContainer: {
    boxShadow: "none", border: "none", marginTop: 0, marginBottom: 10
  },
  datasetLabelColor: (color) => ({
    borderBottom: `solid 3px ${color}`,
  }),
};

KpiChartSegment.propTypes = {
  chart: PropTypes.object.isRequired,
};

export default KpiChartSegment;
