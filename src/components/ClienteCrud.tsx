import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { apiBackend } from "../api/axios";
import { ICliente } from "../types/App";

const schema = yup.object().shape({
  name: yup.string().required("O nome do cliente é obrigatório"),
});

interface IFormInputData {
  name: string
}
interface ClienteCrudProps {
  clientes: ICliente[];
  setClientes: React.Dispatch<React.SetStateAction<ICliente[]>>;
}

export const ClienteCrud: React.FC<ClienteCrudProps> = ({ clientes, setClientes }) => {
  const [error, setError] = useState(null); // Adicione o estado de erro

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Carregue a lista de clientes aqui (GET request)
    apiBackend
      .get("/clientes")
      .then((response) => {
        setClientes(response.data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onSubmit = (data: IFormInputData) => {

    console.log("data ", data)
    // Enviar o novo cliente (POST request)
    apiBackend
      .post("/clientes", data)
      .then((response) => {
        setClientes([...clientes, response.data]);
        reset();
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setError("Cliente já existe."); // Configurar a mensagem de erro
        } else {
          setError("Erro ao adicionar o cliente."); // Outra mensagem de erro genérica
        }
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold">Nome do Cliente</label>
          <input
            {...register("name")}
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do Cliente"
          />
           {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p> // Exibir a mensagem de erro
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Adicionar Cliente
        </button>
      </form>
      <h2 className="text-xl font-semibold">Lista de Clientes</h2>
      <ul className="list-disc ml-4">
        {clientes.map((cliente) => (
          <li
            key={cliente.uuid}
            className="text-blue-500 hover:underline"
          >
            {cliente.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
