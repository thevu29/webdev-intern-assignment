import { Button, Table, TextInput } from "@mantine/core";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { showNotification } from "../../utils/notification";
import { searchScoresService } from "../../services/scoreService";
import { Score } from "../../types/types";

interface FormData {
  registration_number: string;
}

const SearchScore = () => {
  const [score, setScore] = useState<Score | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      registration_number: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const res = await searchScoresService(data.registration_number);

      if (res?.success) {
        setScore(res?.score);
      } else {
        setHasSearched(true);
        setScore(null);
      }
    } catch (error) {
      console.log(error);
      showNotification("An error occured", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-[6px] shadow">
        <h2 className="text-xl font-bold mb-4">User Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-end">
            <Controller
              name="registration_number"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  {...field}
                  error={error?.message}
                  label="Registration Number:"
                  miw={500}
                  placeholder="Enter registration number"
                />
              )}
            />
            <Button
              variant="filled"
              color="indigo"
              ml={16}
              type="submit"
              loading={isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-[6px] shadow mt-8">
        <h2 className="text-xl font-bold mb-4">Scores</h2>
        <Table highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SBD</Table.Th>
              <Table.Th>Toán</Table.Th>
              <Table.Th>Ngữ Văn</Table.Th>
              <Table.Th>Vật Lý</Table.Th>
              <Table.Th>Hóa Học</Table.Th>
              <Table.Th>Sinh Học</Table.Th>
              <Table.Th>Lịch Sử</Table.Th>
              <Table.Th>Địa Lý</Table.Th>
              <Table.Th>Ngoại Ngữ</Table.Th>
              <Table.Th>GDCD</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {hasSearched && !score ? (
              <Table.Tr>
                <Table.Td className="text-center" colSpan={10}>
                  Không tìm thấy dữ liệu
                </Table.Td>
              </Table.Tr>
            ) : (
              score && (
                <Table.Tr>
                  <Table.Td>{score.sbd}</Table.Td>
                  <Table.Td>{score.toan}</Table.Td>
                  <Table.Td>{score.ngu_van}</Table.Td>
                  <Table.Td>{score.vat_li}</Table.Td>
                  <Table.Td>{score.hoa_hoc}</Table.Td>
                  <Table.Td>{score.sinh_hoc}</Table.Td>
                  <Table.Td>{score.lich_su}</Table.Td>
                  <Table.Td>{score.dia_li}</Table.Td>
                  <Table.Td>
                    {score.ngoai_ngu} ({score.ma_ngoai_ngu})
                  </Table.Td>
                  <Table.Td>{score.gdcd}</Table.Td>
                </Table.Tr>
              )
            )}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default SearchScore;
