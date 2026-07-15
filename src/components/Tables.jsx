import Common from "./Common";

const Tables = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-hidden rounded-lg border w-full text-left border-collapse">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-[#1e293b]/20 text-[11px] font-bold tracking-wider text-slate-400">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="p-3 py-4 px-6 text-left">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y text-[14px]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-6 text-slate-500">
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;