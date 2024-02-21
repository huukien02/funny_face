import Select from "react-select";

const Paginations = ({ page, setPage, totalPages }) => {
  let getPages = [];
  for (let i = 1; i <= totalPages; i++) {
    getPages[i - 1] = { value: i, label: i };
  }

  return (
    <Select
      className="basic-single text-2xl sm:text-4xl font-semibold"
      style={{ width: 80 }}
      classNamePrefix="select"
      value={{ value: page, label: page }}
      name="category"
      menuPlacement="bottom"
      options={getPages}
      onChange={(selectedOption) => {
        selectedOption !== null ? setPage(selectedOption.value) : setPage(page);
      }}
    />
  );
};

export default Paginations;
