import { useEffect, useState } from "react";
import { apiBackend } from "./api/axios";
import { ICliente, IContainer, IMovimentacoes, INewCliente } from "./types/App";
import { ClienteCrud } from "./components/ClienteCrud";
import { ContainerCrud } from "./components/ContainerCrud";
import { MovimentacoesCrud } from "./components/MovimentacoesCrud";

export const App = () => {
  const [clientes, setClientes] = useState<INewCliente[]>();

  const [clientesComp, setClientesComp] = useState<ICliente[]>([]);
  const [containers, setContainers] = useState<IContainer[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacoes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiBackend.get("/clientes");
        const clientesData: ICliente[] = response.data.content;
        setClientesComp(clientesData);

        apiBackend.get('/containers')
        .then((response) => {
          setContainers(response.data.content);
        })
        .catch((error) => {
          console.error(error);
        });

        apiBackend.get('/movimentacoes')
        .then((response) => {
          setMovimentacoes(response.data.content);
        })
        .catch((error) => {
          console.error(error);
        });

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
  }, [setMovimentacoes]);

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
      <ClienteCrud clientes={clientesComp} setClientes={setClientesComp} />

      <ContainerCrud containers={containers} setContainers={setContainers} clientes={clientesComp}/>

      <MovimentacoesCrud clientes={clientesComp} containers={containers} movimentacoes={movimentacoes} setMovimentacoes={setMovimentacoes} />
    </div>
  );
};
