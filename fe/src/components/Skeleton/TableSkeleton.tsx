import { Skeleton } from "@mantine/core";

const TableSkeleton = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex justify-center w-full">
        <Skeleton height={30} width="30%" mb="md" />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Top", "SBD", "Toán", "Vật Lý", "Hóa Học", "Tổng điểm"].map(
                (header) => (
                  <th key={header} className="p-4 text-left">
                    <Skeleton className="h-4 w-16" />
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
              >
                <td className="p-4">
                  <Skeleton className="h-4 w-6" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;
