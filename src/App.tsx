import { useEffect, useState } from "react";
import { apiBackend } from "./api/axios";
import { ICliente, INewCliente } from "./types/App";

export const App = () => {
  const [clientes, setClientes] = useState<INewCliente[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiBackend.get("/clientes");
        const clientesData: ICliente[] = response.data.content;

        const resultadoAgrupadoArray = clientesData.map((cliente) => {
          const movimentacoes = cliente.containers.flatMap((container) =>
            container.movimentacoes.map((movimentacao) => {
              const newContainer = {
                numContainer: container.numContainer,
                tipo: container.tipo,
                categoria: container.categoria,
                status: container.status,
                uuid: container.uuid,
                updatedAt: container.updatedAt,
                createdAt: container.createdAt,
              };
              return {
                tipo: movimentacao.tipo,
                container: newContainer,
              };
            })
          );

          return {
            Cliente: cliente.name,
            Movimentacoes: movimentacoes.reduce((acc, movimentacao) => {
              const existingMovimentacao = acc.find(
                (mov) => mov.Tipo === movimentacao.tipo
              );
              if (existingMovimentacao) {
                if (!existingMovimentacao.Conteineres.some((c) => c.uuid === movimentacao.container.uuid)) {
                  existingMovimentacao.Conteineres.push(movimentacao.container);
                }
              } else {
                acc.push({
                  Tipo: movimentacao.tipo,
                  Conteineres: [movimentacao.container],
                });
              }
              return acc;
            }, []),
          };
        });

        setClientes(resultadoAgrupadoArray);
        console.log(resultadoAgrupadoArray);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="w-full">
        {clientes?.map((cliente, index) => {
          let totalImportacoes = 0;
          let totalExportacoes = 0;

          cliente.Movimentacoes.forEach((movimentacao) => {
            const importacoes = movimentacao.Conteineres.filter(
              (conteiner) => conteiner.categoria === "IMPORTACAO"
            ).length;
            const exportacoes = movimentacao.Conteineres.filter(
              (conteiner) => conteiner.categoria === "EXPORTACAO"
            ).length;

            totalImportacoes += importacoes;
            totalExportacoes += exportacoes;
          });

          return (
            <div key={index} className="border border-black p-2 mb-4">
              <div className="font-bold">Cliente: {cliente.Cliente}</div>
              <div className="mb-2">
                <strong>Movimentações:</strong>
              </div>
              {cliente.Movimentacoes.map((movimentacao, indexMov) => (
                <div key={indexMov} className="mb-2">
                  <div className="font-bold">Tipo: {movimentacao.Tipo}</div>
                  <div>
                    <strong>Total de Contêineres Movimentados:</strong>{" "}
                    {movimentacao.Conteineres.length}
                  </div>
                </div>
              ))}
              <div>
                <strong>Total de Importações:</strong> {totalImportacoes}
              </div>
              <div>
                <strong>Total de Exportações:</strong> {totalExportacoes}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
