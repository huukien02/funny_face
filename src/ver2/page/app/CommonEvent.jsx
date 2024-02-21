import React, { useState, useEffect } from "react";
import axios from "axios";
import Empty from "./template/EmptyTemplate";
import Template1 from "./template/Template1";
import Template2 from "./template/Template2";
import Template3 from "./template/Template3";
import Template4 from "./template/Template4";
import { useParams } from "react-router-dom";

const templateComponentList = [Template1, Template2, Template3, Template4];

function CommonEvent(props) {
  const [indexTemplate, setIndexTemplate] = useState(1);
  const TemplateComponent = templateComponentList[indexTemplate];

  const [data, setData] = useState({});
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://databaseswap.mangasocial.online/lovehistory/${
          id || props?.idDefault
        }`
      );
      setData(response.data.sukien[props?.stt - 1]); // Chỉnh index để lấy đúng sự kiện
      const index = response.data.sukien[props?.stt - 1].id_template - 1;
      setIndexTemplate(index);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <TemplateComponent data={data} />
    </div>
  );
}

export default CommonEvent;
