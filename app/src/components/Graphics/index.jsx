import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraphicRechart = ( { data, barcolor }) => {

  return (
    <ResponsiveContainer width={'99%'} height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mounth" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Valor" fill={barcolor} />
      </BarChart>
    </ResponsiveContainer>    
  )
}

export default GraphicRechart