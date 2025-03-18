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
  
  const TopicWiseBarGraph = ({ data }: { data: TopicAnalysis[] }) => {
    const colors = ["#000", "#D1D0D0"]; 
  
    return (
      <Paper sx={{ p: 3, mt: 3 ,boxShadow:"none"}}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="accuracy" shape={<CustomBar />} isAnimationActive={false}>
              {data.map((index:any) => (
                <Cell key={`cell-${index}`} fill={colors[index % 2]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Typography align="center" sx={{ fontSize: "16px" }}>
          Topic Wise Accuracy Overview
        </Typography>
      </Paper>
    );
  };
  
  export default TopicWiseBarGraph;
  