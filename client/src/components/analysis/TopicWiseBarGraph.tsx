import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Cell,
  } from "recharts";
  import { Paper, Typography } from "@mui/material";
  import { TopicAnalysis } from "../../pages/analysis/Analysis";
  
  const CustomBar = (props: any) => {
    const { x, y, height, fill } = props;
    return <rect x={x} y={y} width={32} height={height} fill={fill} rx={10} />;
  };

  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <foreignObject x={x - 30} y={y} width="80" height="50" overflow="visible">
        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            wordBreak: "break-word",
            whiteSpace: "normal",
            width: "80px",
          }}
        >
          {payload.value}
        </div>
      </foreignObject>
    );
  };

  
  const TopicWiseBarGraph = ({ data }: { data: TopicAnalysis[] }) => {
    const colors = ["#000", "#D1D0D0"]; 
  
    return (
      <Paper sx={{ p: 3, mt: 3, boxShadow: "none", overflowX: "auto" }}>
      <div style={{ marginLeft:"-40px",width: Math.max(window.innerWidth - window.innerWidth/10, data.length * 100) }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            barSize={32}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="topic"
              tick={<CustomizedAxisTick />} // Custom tick component for wrapping text
              interval={0} // Show all labels
            />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="accuracy" shape={<CustomBar />} isAnimationActive={false}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 2]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Typography align="center" sx={{ fontSize: "16px" }}>
        Topic Wise Accuracy Overview
      </Typography>
    </Paper>
    
    );
  };
  
  export default TopicWiseBarGraph;
  