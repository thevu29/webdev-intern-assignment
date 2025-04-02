import { useQuery } from "@tanstack/react-query";
import { Table } from "@mantine/core";
import { BarChartData, ScoreStatistic } from "../../types/types";
import { showNotification } from "../../utils/notification";
import {
  getStatisticsService,
  getTop10StudentsGroupAService,
} from "../../services/scoreService";
import BarChart from "../../components/Chart/BarChart";
import BarChartSkeleton from "../../components/Skeleton/BarChartSkeleton";
import TableSkeleton from "../../components/Skeleton/TableSkeleton";

const categories = [">=8", "6<= x <8", "4<= x <6", "<4"];

const subjects = {
  toan: "Toán",
  ngu_van: "Ngữ văn",
  vat_li: "Vật lý",
  hoa_hoc: "Hóa học",
  sinh_hoc: "Sinh học",
  lich_su: "Lịch sử",
  dia_li: "Địa lý",
  ngoai_ngu: "Ngoại ngữ",
  gdcd: "GDCD",
} as const;

const transformStatistics = (statistics: ScoreStatistic[]): BarChartData[] => {
  return statistics.map((score) => ({
    name: subjects[score.subject],
    data: [
      score.greaterThanOrEqual8,
      score.from6To8,
      score.from4To6,
      score.lessThan4,
    ],
  }));
};

const Dashboard = () => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      try {
        const res = await getStatisticsService();

        if (res?.success && res?.statistics?.length > 0) {
          return transformStatistics(res.statistics);
        }

        return [];
      } catch (error) {
        console.error(error);
        showNotification("An error occurred when getting report data", "Error");
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000,
  });

  const { data: top10StudentsGroupA, isLoading: top10Loading } = useQuery({
    queryKey: ["top-10-A"],
    queryFn: async () => {
      try {
        const res = await getTop10StudentsGroupAService();

        if (res?.success && res?.topStudents?.length > 0) {
          return res.topStudents;
        }

        return [];
      } catch (error) {
        console.error(error);
        showNotification(
          "An error occurred when getting top 10 students group A",
          "Error"
        );
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000,
  });

  const rows = top10StudentsGroupA?.map((student, index) => (
    <Table.Tr key={student.registrationNumber}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{student.registrationNumber}</Table.Td>
      <Table.Td>{student.toan}</Table.Td>
      <Table.Td>{student.vat_li}</Table.Td>
      <Table.Td>{student.hoa_hoc}</Table.Td>
      <Table.Td>{student.totalScore}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="bg-white p-8 rounded-[6px] shadow">
        {isLoading ? (
          <BarChartSkeleton />
        ) : (
          <BarChart
            title="Score Report"
            categories={categories}
            series={statistics && statistics.length > 0 ? statistics : []}
          />
        )}
      </div>

      <div className="bg-white p-8 rounded-[6px] shadow mt-8">
        {top10Loading ? (
          <TableSkeleton />
        ) : (
          <>
            <h2 className="text-xl text-center font-bold mb-6">
              Top 10 Students Group A
            </h2>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rank</Table.Th>
                  <Table.Th>SBD</Table.Th>
                  <Table.Th>Toán</Table.Th>
                  <Table.Th>Vật Lý</Table.Th>
                  <Table.Th>Hóa Học</Table.Th>
                  <Table.Th>Tổng điểm</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
