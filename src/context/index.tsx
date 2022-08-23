import { useContext, useEffect, useState, createContext } from "react";
import { ContractDays, Task } from "types/task";

interface HH {
  tasks: Task[] | null;
  contractDays: ContractDays | null;
}
const initialValue = {
  tasks: null,
  contractDays: null,
};
const APIContext = createContext<HH>(initialValue);
export function APIProvider(props: any) {
  const [value, setValue] = useState<HH>(initialValue);
  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch(
        "https://lordashboard.scodus.com/api/employee-tasks"
      );
      const tasks = await response.json();
      response = await fetch(
        "https://lordashboard.scodus.com/api/employee-contracted-hours"
      );
      const contractDays = await response.json();
      setValue({ tasks, contractDays });
    };
    fetchData();
  }, []);
  return <APIContext.Provider value={value} {...props} />;
}

export function useAPIContext() {
  return useContext(APIContext);
}
