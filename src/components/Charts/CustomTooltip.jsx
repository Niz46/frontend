const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
      const { name, count } = payload[0].payload;
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-sky-800 mb-1">
          {name}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">
            {count}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
