import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { apiBackend } from "../api/axios";
import { ICliente, IContainer } from "../types/App";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const categoriaOptions = {
  IMPORTACAO: "IMPORTACAO",
  EXPORTACAO: "EXPORTACAO",
};

const statusOptions = {
  CHEIO: "CHEIO",
  VAZIO: "VAZIO",
};

const tipoOptions = {
  "20": 20,
  "40": 40,
};

const schema = yup.object().shape({
  numContainer: yup
    .string()
    .required("O número do contêiner é obrigatório")
    .matches(
      /^[A-Za-z]{4}\d{7}$/,
      "Deve conter 4 letras seguidas por 7 números."
    ),
});

interface ContainerCrudProps {
  containers: IContainer[];
  setContainers: React.Dispatch<React.SetStateAction<IContainer[]>>;
  clientes: ICliente[];
}

export const ContainerCrud: React.FC<ContainerCrudProps> = ({
  containers,
  setContainers,
  clientes,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputData>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null); // Adicione o estado de erro

  const onSubmit = (data) => {

    console.log(data)


    const request = {
        numContainer: data.numContainer,
        tipo: parseInt(data.tipo.value),
        categoria: data.categoria.value,
        status: data.status.value,
        clienteId: data.name.value
    }

    console.log(request)
    // Enviar o novo cliente (POST request)
    apiBackend
      .post("/containers", request)
      .then((response) => {
        setContainers([...containers, response.data]);
        reset();
        setError(null); // Limpar o erro após o sucesso
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setError("Container já existe."); // Configurar a mensagem de erro
        } else {
          setError("Erro ao adicionar o Container."); // Outra mensagem de erro genérica
        }
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contêineres</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            Número do Contêiner
          </label>
          <Controller
            name="numContainer"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número do Contêiner"
              />
            )}
          />
          {errors.numContainer && (
            <p className="text-red-500 text-sm mt-1">{errors.numContainer.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            Tipo do Contêiner
          </label>
          <Controller
            name="tipo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                options={Object.keys(tipoOptions).map((tipo) => ({
                  label: tipo,
                  value: tipo,
                }))}
                isSearchable={false}
                placeholder="Selecione o Tipo"
                className=""
                classNamePrefix="react-select"
              />
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            Status do Contêiner
          </label>
          <Controller
            name="status"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                options={Object.keys(statusOptions).map((status) => ({
                  label: status,
                  value: status,
                }))}
                isSearchable={false}
                placeholder="Selecione o Status"
                className=""
                classNamePrefix="react-select"
              />
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            Categoria do Contêiner
          </label>
          <Controller
            name="categoria"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                options={Object.values(categoriaOptions).map((categoria) => ({
                  label: categoria,
                  value: categoria,
                }))}
                isSearchable={false}
                placeholder="Selecione a Categoria"
                className=""
                classNamePrefix="react-select"
              />
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Nome do Cliente</label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                options={clientes.map((cliente) => ({
                  label: cliente.name,
                  value: cliente.uuid,
                }))}
                isSearchable={false}
                placeholder="Selecione o Cliente"
                className=""
                classNamePrefix="react-select"
              />
            )}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Adicionar Contêiner
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>
      <h2 className="text-xl font-semibold">Lista de Contêineres</h2>
      <ul className="list-disc ml-4">
        {containers.map((container) => (
          <li key={container.uuid} className="text-blue-500 hover:underline">
            {container.numContainer}
          </li>
        ))}
      </ul>
    </div>
  );
};
