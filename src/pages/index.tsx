import { useQuery } from "react-query";

type Todo = {
  id: number;
  name: string;
  description: string;
};

export default function Home() {
  const todosQuery = useQuery(
    "todos",
    async () => ((await (await fetch("/api/todos")).json()) as Todo[])!
  );

  if (todosQuery.isLoading) return <div>Loading...</div>;
  if (todosQuery.isError) return <div>Error</div>;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formdata = new FormData(event.currentTarget);
    const response = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formdata.entries())),
      headers: {
        "Content-Type": "application/json",
      },
    });

    todosQuery.refetch();
  };

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <form  onSubmit={onSubmit}>
        <div className="flex flex-col border-2 p-4">
          <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="text" name="name" />
          <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="text" name="description" />
          <input  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" value="Submit" />
        </div>
      </form>

      {todosQuery.data?.map((todo) => (
        <div key={todo.id} className="border p-4">
          <h1>{todo.name}</h1>
          <p>{todo.description}</p>
        </div>
      ))}
    </div>
  );
}
