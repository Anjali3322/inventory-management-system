import Common from "./Common";

const Tables = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="p-3 text-left">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-6">
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>

                <td>{item.name}</td>

                <td>{item.description}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="space-x-2">
                  <Common
                    text="Edit"
                    bgColor="bg-yellow-500"
                    onClick={() => onEdit(item)}
                  />

                  <Common
                    text="Delete"
                    bgColor="bg-red-600"
                    onClick={() => onDelete(item.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
