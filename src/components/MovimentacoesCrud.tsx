import { ICliente, IContainer, IMovimentacoes } from "../types/App";
import React, { useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiBackend } from "../api/axios";

const schema = yup.object().shape({
  conteineres: yup
    .array()
    .of(yup.object().required("Selecione pelo menos um contêiner"))
    .min(1, "Selecione pelo menos um contêiner"),
});
const extractValue = (selectedOption) => selectedOption && selectedOption.value;

const tipoMovimentacaoOptions = [
  { label: "Embarque", value: "EMBARQUE" },
  { label: "Descarga", value: "DESCARGA" },
  { label: "Scanner", value: "SCANNER" },
  { label: "Reposicionamento", value: "REPOSICIONAMENTO" },
  { label: "Pesagem", value: "PESAGEM" },
  { label: "Gate In", value: "GATE_IN" },
  { label: "Gate Out", value: "GATE_OUT" },
];

interface MovimentacoesCrudProps {
  containers: IContainer[];
  movimentacoes: IMovimentacoes[];
  setMovimentacoes: React.Dispatch<React.SetStateAction<IMovimentacoes[]>>;
}

export const MovimentacoesCrud: React.FC<MovimentacoesCrudProps> = ({
  containers,
  movimentacoes,
  setMovimentacoes,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data) => {
    const tipo = data.tipo.value; // Acesse a propriedade "value" do objeto selecionado
    const idcontainers = data.conteineres.map((container) => container.value);

    const request = {
      tipo,
      idcontainers,
    };

    apiBackend
      .post("/movimentacoes", request)
      .then((response) => {
        setMovimentacoes([...movimentacoes, response.data]);
        reset();
        setError(null);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setError("Movimentação já existe.");
        } else {
          setError("Erro ao criar a movimentação.");
        }
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movimentações</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold">
            Tipo de Movimentação:
          </label>
          <Controller
            name="tipo"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                options={tipoMovimentacaoOptions}
                isClearable
                placeholder="Selecione o tipo de movimentação"
              />
            )}
          />
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Contêineres:</label>
          <Controller
            name="conteineres"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                options={containers.map((container) => ({
                  label: container.numContainer,
                  value: container.uuid,
                }))}
                isMulti
                closeMenuOnSelect={false}
                placeholder="Selecione os contêineres"
              />
            )}
          />
          {errors.conteineres && (
            <p className="text-red-500 text-sm mt-1">{errors.conteineres.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Criar Movimentação
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};
