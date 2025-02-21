import { Skeleton } from "@mantine/core";

const BarChartSkeleton = () => {
  return (
    <div>
      <div className="flex justify-center w-full">
        <Skeleton height={30} width="30%" mb="md" />
      </div>

      <div className="h-70 w-full flex flex-col justify-end space-y-2">
        <div className="h-full w-full flex items-end justify-center space-x-4 px-10">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton
              key={index}
              width="8%"
              height={`${Math.random() * 70 + 15}%`}
              className="rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChartSkeleton;
